import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { apiFetch } from "./api";
import "./UploadResume.css";

function UploadResume() {
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [file, setFile] = useState(null);

    const [resumeCount, setResumeCount] = useState(0);

    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const MAX_RESUMES = 3;

    useEffect(() => {
        loadResumes();
    }, []);

    async function loadResumes() {
        try {
            setLoading(true);
            setError("");

            const data = await apiFetch("/resumes/");

            setResumeCount(data.length);
        } catch (err) {
            setError(
                err.message || "Unable to load your resumes."
            );
        } finally {
            setLoading(false);
        }
    }

    function handleFileChange(event) {
        const selectedFile = event.target.files[0];

        setError("");
        setSuccess("");

        if (!selectedFile) {
            setFile(null);
            return;
        }

        if (
            !selectedFile.name
                .toLowerCase()
                .endsWith(".pdf")
        ) {
            setError("Only PDF files are allowed.");
            setFile(null);
            return;
        }

        if (selectedFile.size > 5 * 1024 * 1024) {
            setError("File size must not exceed 5 MB.");
            setFile(null);
            return;
        }

        setFile(selectedFile);
    }

    async function handleUpload(event) {
        event.preventDefault();

        setError("");
        setSuccess("");

        if (resumeCount >= MAX_RESUMES) {
            setError(
                "You can upload a maximum of 3 resumes. Delete an existing resume to upload a new one."
            );
            return;
        }

        if (!title.trim()) {
            setError("Please enter a resume title.");
            return;
        }

        if (!file) {
            setError("Please select a PDF file.");
            return;
        }

        try {
            setUploading(true);

            const formData = new FormData();

            formData.append(
                "title",
                title.trim()
            );

            formData.append(
                "file",
                file
            );

            const response = await apiFetch(
                "/resumes/upload/",
                {
                    method: "POST",
                    body: formData,
                }
            );

            setSuccess(
                "Resume uploaded successfully."
            );

            setResumeCount(
                (previousCount) => previousCount + 1
            );

            navigate(`/resumes/${response.id}`);

        } catch (err) {
            setError(
                err.message || "Resume upload failed."
            );
        } finally {
            setUploading(false);
        }
    }

    const limitReached =
        resumeCount >= MAX_RESUMES;

    return (
        <>
            <Navbar />

            <main className="upload-page">

                <div className="upload-container">

                    <div className="upload-header">
                        <div>
                            <p className="upload-eyebrow">
                                Resume Manager
                            </p>

                            <h1>
                                Upload Resume
                            </h1>

                            <p className="upload-subtitle">
                                Upload your resume and compare
                                it against job descriptions
                                using AI.
                            </p>
                        </div>

                        <div className="resume-limit-card">
                            <span>
                                Resume limit
                            </span>

                            <strong>
                                {resumeCount} / {MAX_RESUMES}
                            </strong>
                        </div>
                    </div>


                    {loading ? (
                        <div className="upload-loading">
                            Checking your resume limit...
                        </div>
                    ) : (
                        <>
                            {limitReached && (
                                <div className="limit-warning">
                                    <div className="limit-warning-icon">
                                        !
                                    </div>

                                    <div>
                                        <strong>
                                            Resume limit reached
                                        </strong>

                                        <p>
                                            You already have 3 resumes.
                                            Delete an existing resume
                                            from your dashboard to
                                            upload a new one.
                                        </p>
                                    </div>
                                </div>
                            )}


                            {error && (
                                <div className="upload-error">
                                    {error}
                                </div>
                            )}

                            {success && (
                                <div className="upload-success">
                                    {success}
                                </div>
                            )}


                            <form
                                className="upload-form"
                                onSubmit={handleUpload}
                            >

                                <div className="form-group">

                                    <label htmlFor="title">
                                        Resume Title
                                    </label>

                                    <input
                                        id="title"
                                        type="text"
                                        placeholder="e.g. Python Developer Resume"
                                        value={title}
                                        onChange={(event) =>
                                            setTitle(
                                                event.target.value
                                            )
                                        }
                                        disabled={
                                            limitReached ||
                                            uploading
                                        }
                                    />

                                </div>


                                <div className="form-group">

                                    <label htmlFor="resume-file">
                                        Resume PDF
                                    </label>

                                    <div className="file-upload-box">

                                        <input
                                            id="resume-file"
                                            type="file"
                                            accept=".pdf,application/pdf"
                                            onChange={
                                                handleFileChange
                                            }
                                            disabled={
                                                limitReached ||
                                                uploading
                                            }
                                        />

                                        <div className="file-upload-content">
                                            <span className="upload-icon">
                                                📄
                                            </span>

                                            <strong>
                                                {file
                                                    ? file.name
                                                    : "Choose your resume"}
                                            </strong>

                                            <span>
                                                PDF only · Maximum 5 MB
                                            </span>
                                        </div>

                                    </div>

                                </div>


                                {file && (
                                    <div className="selected-file">

                                        <div>
                                            <strong>
                                                Selected file
                                            </strong>

                                            <span>
                                                {file.name}
                                            </span>
                                        </div>

                                        <span>
                                            {(
                                                file.size /
                                                (1024 * 1024)
                                            ).toFixed(2)}{" "}
                                            MB
                                        </span>

                                    </div>
                                )}


                                <div className="upload-actions">

                                    <button
                                        type="button"
                                        className="cancel-button"
                                        onClick={() =>
                                            navigate("/dashboard")
                                        }
                                        disabled={uploading}
                                    >
                                        Back to Dashboard
                                    </button>


                                    <button
                                        type="submit"
                                        className="upload-button"
                                        disabled={
                                            uploading ||
                                            limitReached ||
                                            loading
                                        }
                                    >
                                        {uploading
                                            ? "Uploading..."
                                            : limitReached
                                            ? "Limit Reached"
                                            : "Upload Resume"}
                                    </button>

                                </div>

                            </form>


                            <div className="upload-tips">

                                <h3>
                                    Upload tips
                                </h3>

                                <ul>
                                    <li>
                                        Use a text-based PDF
                                        for better AI analysis.
                                    </li>

                                    <li>
                                        Keep your resume
                                        updated and relevant
                                        to the job.
                                    </li>

                                    <li>
                                        You can store up to
                                        3 resumes.
                                    </li>
                                </ul>

                            </div>

                        </>
                    )}

                </div>

            </main>
        </>
    );
}

export default UploadResume;

