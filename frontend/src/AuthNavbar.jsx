import { useNavigate } from "react-router-dom";
import "./Navbar.css";

function AuthNavbar() {
    const navigate = useNavigate();

    return (
        <nav className="navbar">
            <div
                className="navbar-logo"
                onClick={() => navigate("/login")}
            >
                <span>Resume</span>AI
            </div>

            <div className="navbar-right">
                <button
                    className="nav-link"
                    onClick={() => navigate("/login")}
                >
                    Login
                </button>

                <button
                    className="nav-link"
                    onClick={() => navigate("/register")}
                >
                    Register
                </button>

                <button
                    className="nav-link"
                    onClick={() =>
                        window.open(
                            "https://ai-resume-analyser-api-8k49.onrender.com/admin/",
                            "_blank"
                        )
                    }
                >
                    Admin
                </button>
            </div>
        </nav>
    );
}

export default AuthNavbar;
