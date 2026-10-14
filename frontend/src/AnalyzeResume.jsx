import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiFetch } from "./api";
import Navbar from "./Navbar";
import "./AnalyzeResume.css";

function AnalyzeResume() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [resume, setResume] = useState(null);
    const [jobDescription, setJobDescription] = useState("");

    const [loading, setLoading] = useState(true);
    const [analyzing, setAnalyzing] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        loadResume();
    }, [id]);

    async function loadResume() {
        try {
            setLoading(true);
            setError("");

            const data = await apiFetch(
                `/resumes/${id}/`
            );

            setResume(data);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    async function handleAnalyze(e) {
        e.preventDefault();

        setError("");

        const jd = jobDescription.trim();

        if (!jd) {
            setError(
                "Please enter a job description."
            );
            return;
        }

        if (jd.length < 20) {
            setError(
                "Job description must be at least 20 characters."
            );
            return;
        }

        try {
            setAnalyzing(true);

            const data = await apiFetch(
                `/resumes/${id}/analyze/`,
                {
                    method: "POST",
                    body: JSON.stringify({
                        job_description: jd,
                    }),
                }
            );

            navigate(`/analyses/${data.id}`);

        } catch (err) {
            setError(err.message);
        } finally {
            setAnalyzing(false);
        }
    }

    if (loading) {
        return (
            <>
                <Navbar />

                <div className="analyze-page">
                    <div className="analyze-loading">
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

                <div className="analyze-page">
                    <div className="analyze-error-page">
                        <h2>
                            Unable to load resume
                        </h2>

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

            <main className="analyze-page">

                <div className="analyze-container">

                    {/* Back */}

                    <button
                        className="analyze-back"
                        onClick={() =>
                            navigate(`/resumes/${id}`)
                        }
                    >
                        ← Back to Resume
                    </button>


                    {/* Header */}

                    <section className="analyze-header">

                        <span className="ai-badge">
                            ✦ AI POWERED ANALYSIS
                        </span>

                        <h1>
                            Analyze your resume
                        </h1>

                        <p>
                            Compare{" "}
                            <strong>
                                {resume.title}
                            </strong>{" "}
                            against a job description and
                            discover how well your resume matches.
                        </p>

                    </section>


                    {/* Main Grid */}

                    <div className="analyze-grid">

                        {/* Form */}

                        <section className="job-description-card">

                            <div className="card-heading">

                                <div className="heading-number">
                                    01
                                </div>

                                <div>
                                    <h2>
                                        Job Description
                                    </h2>

                                    <p>
                                        Paste the job posting
                                        you want to compare
                                        your resume against.
                                    </p>
                                </div>

                            </div>


                            {error && (
                                <div className="analyze-error">
                                    {error}
                                </div>
                            )}


                            <form
                                onSubmit={handleAnalyze}
                            >

                                <div className="textarea-wrapper">

                                    <textarea
                                        value={jobDescription}
                                        onChange={(e) =>
                                            setJobDescription(
                                                e.target.value
                                            )
                                        }
                                        placeholder={
                                            "Example:\n\n" +
                                            "We are looking for a Python Django developer with experience in Django REST Framework, PostgreSQL, REST APIs and Git..."
                                        }
                                        maxLength={10000}
                                        disabled={analyzing}
                                    />

                                    <div className="character-count">
                                        {jobDescription.length}
                                        {" / 10000"}
                                    </div>

                                </div>


                                <button
                                    type="submit"
                                    className="start-analysis-button"
                                    disabled={analyzing}
                                >
                                    {analyzing ? (
                                        <>
                                            <span className="spinner"></span>
                                            Analyzing Resume...
                                        </>
                                    ) : (
                                        <>
                                            ✦ Start AI Analysis
                                        </>
                                    )}
                                </button>

                            </form>

                        </section>


                        {/* Side Information */}

                        <aside className="analysis-info-column">

                            <div className="how-it-works-card">

                                <span className="details-label">
                                    HOW IT WORKS
                                </span>

                                <h2>
                                    Get a smarter resume
                                </h2>

                                <div className="analysis-step">

                                    <div>
                                        1
                                    </div>

                                    <p>
                                        <strong>
                                            Resume
                                        </strong>

                                        <span>
                                            Your uploaded resume
                                            is analyzed.
                                        </span>
                                    </p>

                                </div>


                                <div className="analysis-step">

                                    <div>
                                        2
                                    </div>

                                    <p>
                                        <strong>
                                            Job Description
                                        </strong>

                                        <span>
                                            Requirements are
                                            extracted from the JD.
                                        </span>

                                    </p>

                                </div>


                                <div className="analysis-step">

                                    <div>
                                        3
                                    </div>

                                    <p>
                                        <strong>
                                            AI Comparison
                                        </strong>

                                        <span>
                                            Gemini compares both
                                            and calculates a score.
                                        </span>

                                    </p>

                                </div>


                                <div className="analysis-step">

                                    <div>
                                        4
                                    </div>

                                    <p>
                                        <strong>
                                            Results
                                        </strong>

                                        <span>
                                            Get skills, strengths,
                                            weaknesses and suggestions.
                                        </span>

                                    </p>

                                </div>

                            </div>


                            <div className="analysis-tip-card">

                                <span>
                                    💡 TIP
                                </span>

                                <p>
                                    Copy the complete job
                                    description instead of only
                                    the requirements. This gives
                                    the AI more context for a
                                    realistic match score.
                                </p>

                            </div>

                        </aside>

                    </div>


                    {/* Loading */}

                    {analyzing && (
                        <div className="analysis-loading-card">

                            <div className="loading-spinner"></div>

                            <div>
                                <h3>
                                    AI is analyzing your resume
                                </h3>

                                <p>
                                    Comparing your skills,
                                    experience and projects with
                                    the job requirements...
                                </p>
                            </div>

                        </div>
                    )}

                </div>

            </main>
        </>
    );
}

export default AnalyzeResume;