import { Navigate, useLocation } from "react-router-dom";

function ProtectedRoute({ children }) {
    const accessToken = localStorage.getItem("access");
    const location = useLocation();

    if (!accessToken) {
        return (
            <Navigate
                to="/login"
                replace
                state={{ from: location.pathname }}
            />
        );
    }

    return children;
}

export default ProtectedRoute;