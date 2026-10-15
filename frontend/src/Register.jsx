
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import AuthNavbar from "./AuthNavbar";
import { BASE_URL } from "./api";

function Register() {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleRegister(event) {
        event.preventDefault();
        setError("");

        if (!username.trim()) {
            setError("Username is required.");
            return;
        }

        if (!email.trim()) {
            setError("Email is required.");
            return;
        }

        if (!password) {
            setError("Password is required.");
            return;
        }

        if (password.length < 8) {
            setError("Password must be at least 8 characters.");
            return;
        }

        try {
            setLoading(true);

            // Step 1: Register the account on the production API.
            const registerResponse = await fetch(
                `${BASE_URL}/register/`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        username: username.trim(),
                        email: email.trim(),
                        password,
                    }),
                }
            );

            const registerText = await registerResponse.text();
            let registerData = {};

            try {
                registerData = registerText
                    ? JSON.parse(registerText)
                    : {};
            } catch {
                throw new Error(
                    "Registration API returned an invalid response."
                );
            }

            if (!registerResponse.ok) {
                const firstError = Object.values(registerData)[0];

                if (Array.isArray(firstError)) {
                    throw new Error(String(firstError[0]));
                }

                throw new Error(
                    registerData.detail ||
                    registerData.error ||
                    "Registration failed."
                );
            }

            // Step 2: Log in using the correct login endpoint.
            const loginResponse = await fetch(
                `${BASE_URL}/login/`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        username: username.trim(),
                        password,
                    }),
                }
            );

            const loginText = await loginResponse.text();
            let loginData = {};

            try {
                loginData = loginText
                    ? JSON.parse(loginText)
                    : {};
            } catch {
                throw new Error(
                    "Login API returned an invalid response."
                );
            }

            if (!loginResponse.ok) {
                throw new Error(
                    loginData.detail ||
                    loginData.error ||
                    "Account created, but automatic login failed. Please log in."
                );
            }

            if (!loginData.access || !loginData.refresh) {
                throw new Error(
                    "Login succeeded but the API did not return both tokens."
                );
            }

            // Step 3: Save the tokens and username.
            localStorage.setItem("access", loginData.access);
            localStorage.setItem("refresh", loginData.refresh);
            localStorage.setItem("username", username.trim());

            navigate("/dashboard");

        } catch (err) {
            setError(
                err.message || "Something went wrong."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <AuthNavbar />

            <div className="auth-page">
                <div className="register-layout">
                    <div className="auth-card">
                        <div className="auth-header">
                            <h1>Create Account</h1>
                            <p>
                                Create your ResumeAI1400 account
                            </p>
                        </div>

                        {error && (
                            <div className="auth-error">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleRegister}>
                            <div className="form-group">
                                <label>Username</label>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(event) =>
                                        setUsername(event.target.value)
                                    }
                                    placeholder="Enter username"
                                    disabled={loading}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(event) =>
                                        setEmail(event.target.value)
                                    }
                                    placeholder="Enter email"
                                    disabled={loading}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(event) =>
                                        setPassword(event.target.value)
                                    }
                                    placeholder="Create password"
                                    disabled={loading}
                                    minLength={8}
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="auth-button"
                                disabled={loading}
                            >
                                {loading
                                    ? "Creating Account..."
                                    : "Create Account"}
                            </button>
                        </form>

                        <div className="auth-footer">
                            <span>Already have an account?</span>
                            <button
                                type="button"
                                onClick={() => navigate("/login")}
                            >
                                Login
                            </button>
                        </div>
                    </div>

                    <div className="password-conditions">
                        <h2>Password Requirements</h2>
                        <p>Your password should contain:</p>
                        <ul>
                            <li>At least 8 characters</li>
                            <li>At least 1 uppercase letter</li>
                            <li>At least 1 lowercase letter</li>
                            <li>At least 1 number</li>
                            <li>At least 1 special character</li>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Register;
