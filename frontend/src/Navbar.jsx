import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Navbar.css";

function Navbar() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");

    useEffect(() => {
        const storedUsername = localStorage.getItem("username");

        if (storedUsername) {
            setUsername(storedUsername);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        localStorage.removeItem("username");

        navigate("/login");
    };

    return (
        <nav className="navbar">
            <div
                className="navbar-logo"
                onClick={() => navigate("/dashboard")}
            >
                <span>Resume</span>AI
            </div>

            <div className="navbar-right">
                <button
                    className="nav-link"
                    onClick={() => navigate("/dashboard")}
                >
                    Dashboard
                </button>

                <button
                    className="nav-link"
                    onClick={() => navigate("/upload")}
                >
                    Upload Resume
                </button>

                {username && (
                    <div className="navbar-user">
                        <div className="user-avatar">
                            {username.charAt(0).toUpperCase()}
                        </div>

                        <span>{username}</span>
                    </div>
                )}

                <button
                    className="logout-btn"
                    onClick={handleLogout}
                >
                    Logout
                </button>
            </div>
        </nav>
    );
}

export default Navbar;