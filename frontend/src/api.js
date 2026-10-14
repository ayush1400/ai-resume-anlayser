const BASE_URL = "https://ai-resume-analyser-api-8k49.onrender.com/api";

export async function apiFetch(endpoint, options = {}) {
    let accessToken = localStorage.getItem("access");

    async function makeRequest(token) {
        const headers = {
            ...options.headers,
        };

        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }

        if (
            options.body &&
            !(options.body instanceof FormData)
        ) {
            headers["Content-Type"] = "application/json";
        }

        return fetch(
            `${BASE_URL}${endpoint}`,
            {
                ...options,
                headers,
            }
        );
    }

    let response = await makeRequest(accessToken);

    // Access token expired/invalid
    if (response.status === 401) {

        const refreshToken =
            localStorage.getItem("refresh");

        if (!refreshToken) {
            localStorage.removeItem("access");
            localStorage.removeItem("refresh");

            window.location.href = "/login";

            throw new Error("Session expired. Please login again.");
        }

        const refreshResponse = await fetch(
            `${BASE_URL}/token/refresh/`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                },

                body: JSON.stringify({
                    refresh: refreshToken,
                }),
            }
        );

        const refreshText =
            await refreshResponse.text();

        let refreshData;

        try {
            refreshData = refreshText
                ? JSON.parse(refreshText)
                : {};
        } catch {
            throw new Error(
                "Token refresh returned an invalid response."
            );
        }

        if (!refreshResponse.ok) {
            localStorage.removeItem("access");
            localStorage.removeItem("refresh");

            window.location.href = "/login";

            throw new Error(
                "Session expired. Please login again."
            );
        }

        // Save new access token
        accessToken = refreshData.access;

        localStorage.setItem(
            "access",
            accessToken
        );

        // Retry original request
        response = await makeRequest(accessToken);
    }

    const text = await response.text();

    let data;

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
            "Something went wrong."
        );
    }

    return data;
}
