import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import AuthNavbar from "./AuthNavbar";

function Login() {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleLogin(event) {
        event.preventDefault();

        setError("");

        if (!username.trim() || !password.trim()) {
            setError("Username and password are required.");
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(
                "https://ai-resume-analyser-api-8k49.onrender.com/api/login/",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        username: username.trim(),
                        password: password,
                    }),
                }
            );

            const responseText = await response.text();

            let data;

            try {
                data = responseText
                    ? JSON.parse(responseText)
                    : {};
            } catch {
                throw new Error(
                    "Login API returned an invalid response."
                );
            }

            if (!response.ok) {
                throw new Error(
                    data.detail ||
                    data.error ||
                    "Invalid username or password."
                );
            }

            localStorage.setItem(
                "access",
                data.access
            );

            localStorage.setItem(
                "refresh",
                data.refresh
            );

            localStorage.setItem(
                "username",
                username.trim()
            );

            navigate("/dashboard");

        } catch (err) {
            setError(
                err.message ||
                "Something went wrong."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <AuthNavbar />

            <div className="auth-page">

                <div className="login-layout">

                    {/* LEFT SIDE - LOGIN FORM */}
                    <div className="auth-card">

                        <div className="auth-header">
                            <h1>Welcome Back</h1>

                            <p>
                                Login to your ResumeAI account
                            </p>
                        </div>

                        {error && (
                            <div className="auth-error">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleLogin}>

                            <div className="form-group">
                                <label>
                                    Username
                                </label>

                                <input
                                    type="text"
                                    value={username}
                                    onChange={(event) => {
                                        setUsername(
                                            event.target.value
                                        );
                                        setError("");
                                    }}
                                    placeholder="Enter username"
                                    disabled={loading}
                                />
                            </div>

                            <div className="form-group">
                                <label>
                                    Password
                                </label>

                                <input
                                    type="password"
                                    value={password}
                                    onChange={(event) => {
                                        setPassword(
                                            event.target.value
                                        );
                                        setError("");
                                    }}
                                    placeholder="Enter password"
                                    disabled={loading}
                                />
                            </div>

                            <button
                                type="submit"
                                className="auth-button"
                                disabled={loading}
                            >
                                {loading
                                    ? "Logging In..."
                                    : "Login"}
                            </button>

                        </form>

                        <div className="auth-footer">
                            <span>
                                Don't have an account?
                            </span>

                            <button
                                type="button"
                                onClick={() =>
                                    navigate("/register")
                                }
                            >
                                Register
                            </button>
                        </div>

                    </div>

                    {/* RIGHT SIDE - DEMO CREDENTIALS */}
                    <div className="demo-credentials">

                        <h2>Demo Account</h2>

                        <p>
                            Use these credentials to
                            explore ResumeAI.
                        </p>

                        <div className="demo-item">
                            <span>
                                <strong>Username:</strong>{" "}
                                DEMOUSER
                            </span>
                        </div>

                        <div className="demo-item">
                            <span>
                                <strong>Password:</strong>{" "}
                                Demo@1234
                            </span>
                        </div>

                    </div>

                </div>

            </div>
        </>
    );
}

export default Login;
