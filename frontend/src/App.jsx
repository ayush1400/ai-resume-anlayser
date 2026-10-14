import React from "react";
import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
    useNavigate
} from "react-router-dom";

import Login from "./Login";
import Register from "./Register";
import ProtectedRoute from "./ProtectedRoute";
import UploadResume from "./UploadResume";
import ResumeDetails from "./ResumeDetails";
import AnalyzeResume from "./AnalyzeResume";
import AnalysisDetails from "./AnalysisDetails";
import Dashboard from "./Dashboard";
import { apiFetch } from "./api";


function App() {
    return (
        <BrowserRouter>
            <Routes>

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="*"
                    element={
                        <Navigate
                            to="/login"
                            replace
                        />
                    }
                />

                <Route
                    path="/upload"
                    element={
                    <ProtectedRoute>
                        <UploadResume />
                    </ProtectedRoute>
                    }
                />

                <Route
                    path="/resumes/:id"
                        element={
                    <ProtectedRoute>
                        <ResumeDetails />
                    </ProtectedRoute>
                    }
                />

                <Route
                    path="/resumes/:id/analyze"
                        element={
                            <ProtectedRoute>
                                <AnalyzeResume />
                            </ProtectedRoute>
                        }
                />

                <Route
                    path="/analyses/:id"
                    element={ <ProtectedRoute> <AnalysisDetails /></ProtectedRoute>}
                />




            </Routes>
        </BrowserRouter>
    );
}

export default App;