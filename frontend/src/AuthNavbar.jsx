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
                            "http://127.0.0.1:8000/admin/",
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
