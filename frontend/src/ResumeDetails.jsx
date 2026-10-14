import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiFetch } from "./api";
import Navbar from "./Navbar";
import "./ResumeDetails.css";

function ResumeDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [resume, setResume] = useState(null);
    const [analyses, setAnalyses] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        loadResume();
    }, [id]);

    async function loadResume() {
        try {
            setLoading(true);
            setError("");

            const resumeData = await apiFetch(
                `/resumes/${id}/`
            );

            const analysisData = await apiFetch(
                `/resumes/${id}/analyses/`
            );

            setResume(resumeData);
            setAnalyses(analysisData);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete() {
        const confirmed = window.confirm(
            "Are you sure you want to delete this resume?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeleting(true);

            await apiFetch(`/resumes/${id}/`, {
                method: "DELETE",
            });

            navigate("/dashboard");

        } catch (err) {
            setError(err.message);
            setDeleting(false);
        }
    }

    function getScoreClass(score) {
        if (score >= 70) return "score-high";
        if (score >= 40) return "score-medium";
        return "score-low";
    }

    function getScoreLabel(score) {
        if (score >= 70) return "Strong Match";
        if (score >= 40) return "Moderate Match";
        return "Needs Improvement";
    }

    function handleViewResume() {
        if (!resume?.file_url) {
            setError("Resume file is not available.");
            return;
        }

        window.open(
            resume.file_url,
            "_blank",
            "noopener,noreferrer"
        );
    }

    if (loading) {
        return (
            <>
                <Navbar />

                <div className="resume-details-page">
                    <div className="details-loading">
                        Loading resume...
                    </div>
                </div>
            </>
        );
    }

    if (error && !resume) {
        return (
            <>
                <Navbar />

                <div className="resume-details-page">
                    <div className="details-error">
                        <h2>Unable to load resume</h2>

                        <p>{error}</p>

                        <button
                            onClick={() =>
                                navigate("/dashboard")
                            }
                        >
                            ← Back to Dashboard
                        </button>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />

            <main className="resume-details-page">

                <div className="resume-details-container">

                    {/* Back */}

                    <button
                        className="details-back"
                        onClick={() =>
                            navigate("/dashboard")
                        }
                    >
                        ← Back to Dashboard
                    </button>


                    {/* Resume Header */}

                    <section className="resume-main-card">

                        <div className="resume-main-info">

                            <div className="large-pdf-icon">
                                PDF
                            </div>

                            <div>
                                <span className="details-label">
                                    RESUME
                                </span>

                                <h1>
                                    {resume.title}
                                </h1>

                                <p>
                                    Uploaded on{" "}
                                    {new Date(
                                        resume.uploaded_at
                                    ).toLocaleDateString(
                                        undefined,
                                        {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        }
                                    )}
                                </p>
                            </div>

                        </div>


                        <div className="resume-actions">

                            {/* View Resume */}

                            {resume.file_url && (
                                <button
                                    className="view-resume-button"
                                    onClick={handleViewResume}
                                >
                                    📄 View Resume
                                </button>
                            )}

                            {/* Analyze Resume */}

                            <button
                                className="analyze-button"
                                onClick={() =>
                                    navigate(
                                        `/resumes/${id}/analyze`
                                    )
                                }
                            >
                                ✦ Analyze Resume
                            </button>

                            {/* Delete */}

                            <button
                                className="delete-button"
                                onClick={handleDelete}
                                disabled={deleting}
                            >
                                {deleting
                                    ? "Deleting..."
                                    : "Delete"}
                            </button>

                        </div>

                    </section>


                    {/* Error */}

                    {error && (
                        <div className="details-inline-error">
                            {error}
                        </div>
                    )}


                    {/* File Information */}

                    <section className="file-info-card">

                        <div className="section-title-row">

                            <div>
                                <span className="details-label">
                                    FILE INFORMATION
                                </span>

                                <h2>
                                    Resume Details
                                </h2>
                            </div>

                            <span className="file-type-badge">
                                PDF
                            </span>

                        </div>


                        <div className="file-info-grid">

                            <div>
                                <span>File name</span>

                                <strong>
                                    {resume.file
                                        ? resume.file
                                              .split("/")
                                              .pop()
                                        : "Resume PDF"}
                                </strong>
                            </div>

                            <div>
                                <span>Status</span>

                                <strong className="status-success">
                                    ✓ Uploaded
                                </strong>
                            </div>

                            <div>
                                <span>Resume ID</span>

                                <strong>
                                    #{resume.id}
                                </strong>
                            </div>

                        </div>

                    </section>


                    {/* Analyses */}

                    <section className="analyses-section">

                        <div className="section-heading-block">

                            <span className="details-label">
                                AI ANALYSIS HISTORY
                            </span>

                            <h2>
                                Previous Analyses
                            </h2>

                            <p>
                                View the results of previous
                                job-description comparisons.
                            </p>

                        </div>


                        {analyses.length === 0 ? (

                            <div className="no-analysis-card">

                                <div className="empty-analysis-icon">
                                    ✦
                                </div>

                                <h3>
                                    No analyses yet
                                </h3>

                                <p>
                                    Compare this resume with a
                                    job description to get your
                                    first AI analysis.
                                </p>

                                <button
                                    className="analyze-button"
                                    onClick={() =>
                                        navigate(
                                            `/resumes/${id}/analyze`
                                        )
                                    }
                                >
                                    Analyze Resume
                                </button>

                            </div>

                        ) : (

                            <div className="analysis-list">

                                {analyses.map((analysis) => (

                                    <div
                                        className="analysis-card"
                                        key={analysis.id}
                                    >

                                        <div className="analysis-card-left">

                                            <div
                                                className={`analysis-score ${getScoreClass(
                                                    analysis.score
                                                )}`}
                                            >
                                                {analysis.score}
                                            </div>

                                            <div className="analysis-info">

                                                <span>
                                                    Analysis #{analysis.id}
                                                </span>

                                                <h3>
                                                    {getScoreLabel(
                                                        analysis.score
                                                    )}
                                                </h3>

                                                <p>
                                                    Created on{" "}
                                                    {new Date(
                                                        analysis.created_at
                                                    ).toLocaleDateString()}
                                                </p>

                                            </div>

                                        </div>


                                        <button
                                            className="view-analysis-btn"
                                            onClick={() =>
                                                navigate(
                                                    `/analyses/${analysis.id}`
                                                )
                                            }
                                        >
                                            View Analysis →
                                        </button>

                                    </div>

                                ))}

                            </div>

                        )}

                    </section>


                    {/* Bottom Action */}

                    <section className="resume-bottom-action">

                        <div>
                            <span>
                                READY TO CHECK ANOTHER JOB?
                            </span>

                            <h2>
                                Analyze this resume against
                                another job description.
                            </h2>
                        </div>

                        <button
                            onClick={() =>
                                navigate(
                                    `/resumes/${id}/analyze`
                                )
                            }
                        >
                            Start Analysis →
                        </button>

                    </section>

                </div>

            </main>
        </>
    );
}

export default ResumeDetails;

