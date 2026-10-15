
const LOCAL_API_URL = "http://127.0.0.1:8000/api";

export const BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || LOCAL_API_URL
).replace(/\/+$/, "");

export const API_ROOT = BASE_URL.replace(/\/api$/, "");

export async function apiFetch(endpoint, options = {}) {
  let accessToken = localStorage.getItem("access");

  async function makeRequest(token) {
    const headers = { ...options.headers };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    if (
      options.body &&
      !(options.body instanceof FormData)
    ) {
      headers["Content-Type"] = "application/json";
    }

    return fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });
  }

  let response = await makeRequest(accessToken);

  // Refresh the access token when it expires.
  if (response.status === 401) {
    const refreshToken = localStorage.getItem("refresh");

    if (!refreshToken) {
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      throw new Error("Session expired. Please log in again.");
    }

    const refreshResponse = await fetch(
      `${BASE_URL}/token/refresh/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh: refreshToken }),
      }
    );

    const refreshText = await refreshResponse.text();
    let refreshData = {};

    try {
      refreshData = refreshText ? JSON.parse(refreshText) : {};
    } catch {
      throw new Error("Token refresh returned an invalid response.");
    }

    if (!refreshResponse.ok || !refreshData.access) {
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      throw new Error("Session expired. Please log in again.");
    }

    accessToken = refreshData.access;
    localStorage.setItem("access", accessToken);

    response = await makeRequest(accessToken);
  }

  const text = await response.text();
  let data = {};

  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    throw new Error(
      `API ${endpoint} returned an invalid response. Status: ${response.status}`
    );
  }

  if (!response.ok) {
    throw new Error(
      data.detail ||
      data.error ||
      data.message ||
      `Request failed with status ${response.status}.`
    );
  }

  return data;
}
