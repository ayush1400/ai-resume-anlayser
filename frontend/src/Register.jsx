import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import AuthNavbar from "./AuthNavbar";

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

        if (password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        try {
            setLoading(true);

            // Register user
            const registerResponse = await fetch(
                "https://ai-resume-analyser-api-8k49.onrender.com/api/register/",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        username: username.trim(),
                        email: email.trim(),
                        password: password,
                    }),
                }
            );

            const registerText = await registerResponse.text();

            let registerData;

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
                    throw new Error(firstError[0]);
                }

                throw new Error(
                    registerData.detail ||
                    registerData.error ||
                    "Registration failed."
                );
            }

            // Automatically login after registration
            const loginResponse = await fetch(
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

            const loginText = await loginResponse.text();

            let loginData;

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
                    "Automatic login failed."
                );
            }

            // Save JWT tokens
            localStorage.setItem(
                "access",
                loginData.access
            );

            localStorage.setItem(
                "refresh",
                loginData.refresh
            );

            localStorage.setItem(
                "username",
                username.trim()
            );

            // Go directly to dashboard
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

                <div className="register-layout">

                    {/* LEFT SIDE - REGISTER FORM */}
                    <div className="auth-card">

                        <div className="auth-header">
                            <h1>Create Account</h1>

                            <p>
                                Create your ResumeAI account
                            </p>
                        </div>

                        {error && (
                            <div className="auth-error">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleRegister}>

                            <div className="form-group">
                                <label>
                                    Username
                                </label>

                                <input
                                    type="text"
                                    value={username}
                                    onChange={(event) =>
                                        setUsername(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Enter username"
                                    disabled={loading}
                                />
                            </div>

                            <div className="form-group">
                                <label>
                                    Email
                                </label>

                                <input
                                    type="email"
                                    value={email}
                                    onChange={(event) =>
                                        setEmail(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Enter email"
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
                                    onChange={(event) =>
                                        setPassword(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Create password"
                                    disabled={loading}
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
                            <span>
                                Already have an account?
                            </span>

                            <button
                                type="button"
                                onClick={() =>
                                    navigate("/login")
                                }
                            >
                                Login
                            </button>
                        </div>

                    </div>

                    {/* RIGHT SIDE - PASSWORD CONDITIONS */}
                    <div className="password-conditions">

                        <h2>Password Requirements</h2>

                        <p>
                            Your password should contain:
                        </p>

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
