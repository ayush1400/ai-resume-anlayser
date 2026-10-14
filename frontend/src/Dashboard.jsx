import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "./api";
import "./Dashboard.css";
import Navbar from "./Navbar";

function Dashboard() {
    const navigate = useNavigate();

    const [dashboard, setDashboard] = useState(null);
    const [resumes, setResumes] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadDashboard();
    }, []);

    async function loadDashboard() {
        try {
            setError("");

            const dashboardData =
                await apiFetch("/dashboard/");

            const resumeData =
                await apiFetch("/resumes/");

            setDashboard(dashboardData);
            setResumes(resumeData);

        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <>
                <Navbar />

                <div className="dashboard-page">
                    <div className="dashboard-loading">
                        Loading dashboard...
                    </div>
                </div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <Navbar />

                <div className="dashboard-page">
                    <div className="dashboard-error">
                        <h2>Unable to load dashboard</h2>

                        <p>{error}</p>

                        <button
                            className="primary-button"
                            onClick={loadDashboard}
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </>
        );
    }

    const latestAnalysis =
        dashboard?.latest_analysis;

    const latestScore =
        latestAnalysis?.score ?? 0;

    let scoreClass = "low";

    if (latestScore >= 70) {
        scoreClass = "high";
    } else if (latestScore >= 40) {
        scoreClass = "medium";
    }

    return (
        <>
            <Navbar />

            <div className="dashboard-page">

                <main className="dashboard-container">

                    {/* Hero */}

                    <section className="dashboard-hero">

                        <div>
                            <p className="hero-label">
                                YOUR DASHBOARD
                            </p>

                            <h1>
                                Analyze your resume.
                                <br />
                                Improve your career.
                            </h1>

                            <p className="hero-description">
                                Upload your resume and compare it
                                against a job description using AI.
                            </p>
                        </div>

                        <button
                            className="upload-button"
                            onClick={() =>
                                navigate("/upload")
                            }
                        >
                            + Upload Resume
                        </button>

                    </section>


                    {/* Statistics */}

                    <section className="stats-grid">

                        <div className="stat-card">

                            <div className="stat-icon">
                                📄
                            </div>

                            <div>
                                <p>Total Resumes</p>

                                <h2>
                                    {dashboard.total_resumes}
                                </h2>
                            </div>

                        </div>


                        <div className="stat-card">

                            <div className="stat-icon">
                                ✦
                            </div>

                            <div>
                                <p>Total Analyses</p>

                                <h2>
                                    {dashboard.total_analyses}
                                </h2>
                            </div>

                        </div>


                        <div className="stat-card">

                            <div className="stat-icon">
                                🎯
                            </div>

                            <div>
                                <p>Latest Score</p>

                                <h2>
                                    {latestAnalysis
                                        ? `${latestScore}/100`
                                        : "--"}
                                </h2>
                            </div>

                        </div>

                    </section>


                    {/* Latest Analysis */}

                    {latestAnalysis && (
                        <section className="latest-analysis-card">

                            <div className="latest-analysis-left">

                                <div className="section-heading">

                                    <span className="heading-icon">
                                        ✦
                                    </span>

                                    <div>
                                        <p>
                                            LATEST ANALYSIS
                                        </p>

                                        <h2>
                                            Resume Match Result
                                        </h2>
                                    </div>

                                </div>

                                <p className="analysis-description">
                                    Your latest resume analysis
                                    has been completed against
                                    a job description.
                                </p>

                                <button
                                    className="view-analysis-button"
                                    onClick={() =>
                                        navigate(
                                            `/analyses/${latestAnalysis.id}`
                                        )
                                    }
                                >
                                    View Full Analysis →
                                </button>

                            </div>


                            <div className="latest-score">

                                <div
                                    className={`score-circle ${scoreClass}`}
                                >
                                    <span>
                                        {latestScore}
                                    </span>

                                    <small>
                                        /100
                                    </small>
                                </div>

                                <strong>
                                    {latestScore >= 70
                                        ? "Strong Match"
                                        : latestScore >= 40
                                        ? "Moderate Match"
                                        : "Needs Improvement"}
                                </strong>

                            </div>

                        </section>
                    )}


                    {/* Resumes */}

                    <section className="resumes-section">

                        <div className="section-header">

                            <div>
                                <p className="section-label">
                                    YOUR FILES
                                </p>

                                <h2>
                                    My Resumes
                                </h2>
                            </div>

                            <button
                                className="small-upload-button"
                                onClick={() =>
                                    navigate("/upload")
                                }
                            >
                                + Upload
                            </button>

                        </div>


                        {resumes.length === 0 ? (

                            <div className="empty-resumes">

                                <div className="empty-icon">
                                    📄
                                </div>

                                <h3>
                                    No resumes yet
                                </h3>

                                <p>
                                    Upload your first resume
                                    to start analyzing it.
                                </p>

                                <button
                                    className="primary-button"
                                    onClick={() =>
                                        navigate("/upload")
                                    }
                                >
                                    Upload Resume
                                </button>

                            </div>

                        ) : (

                            <div className="resume-grid">

                                {resumes.map((resume) => (

                                    <div
                                        className="resume-card"
                                        key={resume.id}
                                    >

                                        <div className="resume-card-top">

                                            <div className="pdf-icon">
                                                PDF
                                            </div>

                                            <span className="resume-status">
                                                Uploaded
                                            </span>

                                        </div>


                                        <h3>
                                            {resume.title}
                                        </h3>


                                        <p className="resume-date">
                                            Uploaded on{" "}
                                            {new Date(
                                                resume.uploaded_at
                                            ).toLocaleDateString()}
                                        </p>


                                        <button
                                            className="view-resume-button"
                                            onClick={() =>
                                                navigate(
                                                    `/resumes/${resume.id}`
                                                )
                                            }
                                        >
                                            View Resume
                                            <span>→</span>
                                        </button>

                                    </div>

                                ))}

                            </div>

                        )}

                    </section>


                    {/* Quick Action */}

                    <section className="quick-action">

                        <div>
                            <p>
                                READY FOR YOUR NEXT APPLICATION?
                            </p>

                            <h2>
                                Compare your resume with a
                                new job description.
                            </h2>
                        </div>

                        <button
                            onClick={() =>
                                navigate("/upload")
                            }
                        >
                            Analyze Resume →
                        </button>

                    </section>

                </main>

            </div>
        </>
    );
}

export default Dashboard;