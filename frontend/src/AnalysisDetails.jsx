import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiFetch } from "./api";
import Navbar from "./Navbar";
import "./AnalysisDetails.css";

function AnalysisDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadAnalysis();
    }, [id]);

    async function loadAnalysis() {
        try {
            setLoading(true);
            setError("");

            const data = await apiFetch(`/analyses/${id}/`);
            setAnalysis(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    function getScoreClass(score) {
        if (score >= 80) return "score-high";
        if (score >= 60) return "score-medium";
        return "score-low";
    }

    if (loading) {
        return (
            <>
                <Navbar />

                <div className="analysis-details-page">
                    <div className="analysis-loading">
                        Loading analysis...
                    </div>
                </div>
            </>
        );
    }

    if (error || !analysis) {
        return (
            <>
                <Navbar />

                <div className="analysis-details-page">
                    <div className="analysis-error-page">
                        <div className="error-icon">!</div>

                        <h2>Unable to load analysis</h2>

                        <p>{error || "Analysis not found."}</p>

                        <button
                            onClick={() => navigate("/dashboard")}
                        >
                            ← Back to Dashboard
                        </button>
                    </div>
                </div>
            </>
        );
    }

    const result = analysis.analysis_result || {};

    return (
        <>
            <Navbar />

            <main className="analysis-details-page">
                <div className="analysis-details-container">

                    <button
                        className="analysis-back"
                        onClick={() =>
                            navigate(`/resumes/${analysis.resume}`)
                        }
                    >
                        ← Back to Resume
                    </button>

                    {/* Header */}
                    <section className="analysis-header">

                        <div>
                            <span className="ai-badge">
                                ✦ AI ANALYSIS RESULT
                            </span>

                            <h1>
                                Resume Analysis
                            </h1>

                            <p>
                                Here's how your resume matches
                                the job description.
                            </p>
                        </div>

                        <div className="analysis-score-card">

                            <div
                                className={`score-circle-large ${getScoreClass(
                                    analysis.score
                                )}`}
                            >
                                <span>{analysis.score}</span>
                                <small>/100</small>
                            </div>

                            <div className="score-info">
                                <span>RESUME MATCH</span>

                                <strong
                                    className={getScoreClass(
                                        analysis.score
                                    )}
                                >
                                    {analysis.score >= 80
                                        ? "Excellent Match"
                                        : analysis.score >= 60
                                        ? "Good Match"
                                        : "Needs Improvement"}
                                </strong>
                            </div>

                        </div>

                    </section>

                    {/* Job Description */}
                    <section className="analysis-card job-card">

                        <div className="section-title">
                            <div className="section-icon">
                                JD
                            </div>

                            <div>
                                <span className="section-label">
                                    JOB DESCRIPTION
                                </span>

                                <h2>
                                    Position Requirements
                                </h2>
                            </div>
                        </div>

                        <div className="job-description">
                            {analysis.job_description}
                        </div>

                    </section>

                    {/* Skills */}
                    <div className="analysis-two-column">

                        <section className="analysis-card">

                            <div className="section-title">
                                <div className="section-icon success">
                                    ✓
                                </div>

                                <div>
                                    <span className="section-label">
                                        MATCHED SKILLS
                                    </span>

                                    <h2>
                                        What you already have
                                    </h2>
                                </div>
                            </div>

                            <div className="tag-list">

                                {result.matched_skills?.length > 0 ? (
                                    result.matched_skills.map(
                                        (skill, index) => (
                                            <span
                                                className="skill-tag matched"
                                                key={index}
                                            >
                                                ✓ {skill}
                                            </span>
                                        )
                                    )
                                ) : (
                                    <p className="empty-text">
                                        No matched skills found.
                                    </p>
                                )}

                            </div>

                        </section>

                        <section className="analysis-card">

                            <div className="section-title">
                                <div className="section-icon warning">
                                    !
                                </div>

                                <div>
                                    <span className="section-label">
                                        MISSING SKILLS
                                    </span>

                                    <h2>
                                        Skills to improve
                                    </h2>
                                </div>
                            </div>

                            <div className="tag-list">

                                {result.missing_skills?.length > 0 ? (
                                    result.missing_skills.map(
                                        (skill, index) => (
                                            <span
                                                className="skill-tag missing"
                                                key={index}
                                            >
                                                + {skill}
                                            </span>
                                        )
                                    )
                                ) : (
                                    <p className="empty-text">
                                        No missing skills identified.
                                    </p>
                                )}

                            </div>

                        </section>

                    </div>

                    {/* Strengths & Weaknesses */}
                    <div className="analysis-two-column">

                        <section className="analysis-card">

                            <div className="section-title">
                                <div className="section-icon success">
                                    ↑
                                </div>

                                <div>
                                    <span className="section-label">
                                        STRENGTHS
                                    </span>

                                    <h2>
                                        Your advantages
                                    </h2>
                                </div>
                            </div>

                            <ul className="analysis-list">

                                {result.strengths?.length > 0 ? (
                                    result.strengths.map(
                                        (item, index) => (
                                            <li key={index}>
                                                <span>✓</span>
                                                {item}
                                            </li>
                                        )
                                    )
                                ) : (
                                    <li className="empty-text">
                                        No strengths identified.
                                    </li>
                                )}

                            </ul>

                        </section>

                        <section className="analysis-card">

                            <div className="section-title">
                                <div className="section-icon danger">
                                    ↓
                                </div>

                                <div>
                                    <span className="section-label">
                                        WEAKNESSES
                                    </span>

                                    <h2>
                                        Areas to improve
                                    </h2>
                                </div>
                            </div>

                            <ul className="analysis-list">

                                {result.weaknesses?.length > 0 ? (
                                    result.weaknesses.map(
                                        (item, index) => (
                                            <li key={index}>
                                                <span>!</span>
                                                {item}
                                            </li>
                                        )
                                    )
                                ) : (
                                    <li className="empty-text">
                                        No major weaknesses identified.
                                    </li>
                                )}

                            </ul>

                        </section>

                    </div>

                    {/* Suggestions */}
                    <section className="analysis-card suggestions-card">

                        <div className="section-title">

                            <div className="section-icon ai">
                                ✦
                            </div>

                            <div>
                                <span className="section-label">
                                    AI RECOMMENDATIONS
                                </span>

                                <h2>
                                    How to improve your resume
                                </h2>
                            </div>

                        </div>

                        <div className="suggestions-list">

                            {result.suggestions?.length > 0 ? (
                                result.suggestions.map(
                                    (suggestion, index) => (
                                        <div
                                            className="suggestion-item"
                                            key={index}
                                        >
                                            <div className="suggestion-number">
                                                {index + 1}
                                            </div>

                                            <p>
                                                {suggestion}
                                            </p>
                                        </div>
                                    )
                                )
                            ) : (
                                <p className="empty-text">
                                    No suggestions available.
                                </p>
                            )}

                        </div>

                    </section>

                    {/* Bottom actions */}
                    <div className="analysis-actions">

                        <button
                            className="secondary-button"
                            onClick={() =>
                                navigate(
                                    `/resumes/${analysis.resume}`
                                )
                            }
                        >
                            ← Back to Resume
                        </button>

                        <button
                            className="primary-button"
                            onClick={() =>
                                navigate("/dashboard")
                            }
                        >
                            Go to Dashboard
                        </button>

                    </div>

                </div>
            </main>
        </>
    );
}

export default AnalysisDetails;