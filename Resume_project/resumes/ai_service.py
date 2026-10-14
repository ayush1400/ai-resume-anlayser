from google import genai
from django.conf import settings
from pydantic import BaseModel
from typing import List


class ResumeAnalysisResult(BaseModel):
    score: int
    matched_skills: List[str]
    missing_skills: List[str]
    strengths: List[str]
    weaknesses: List[str]
    suggestions: List[str]


if not settings.GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY is not configured.")

client = genai.Client(api_key=settings.GEMINI_API_KEY)


def analyze_resume(resume_text, job_description):

    prompt = f"""
        You are an expert technical recruiter.

        Analyze the resume against the job description.

        Give a realistic match score from 0 to 100.

        Consider:
        - Technical skills
        - Programming languages
        - Frameworks
        - Databases
        - Tools
        - Experience
        - Relevant projects
        - Job requirements

        Do not invent skills that are not present in the resume.

        RESUME:
        {resume_text}

        JOB DESCRIPTION:
        {job_description}

        Return the analysis in the requested JSON structure.
        
        """

    response = client.models.generate_content(model="gemini-3.5-flash-lite", contents=prompt,
        config={
            "response_mime_type": "application/json",
            "response_schema": ResumeAnalysisResult,},
    )

    result = ResumeAnalysisResult.model_validate_json(response.text)

    return result