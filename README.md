# AI Resume Analyzer

An AI-powered resume analysis application built with Django REST Framework and React. Users can upload resumes, compare them against a job description, and receive an AI-generated match score with detailed feedback.

## Features

- User registration and JWT authentication
- Secure login and logout
- Upload resumes in PDF format
- Maximum 3 resumes per user
- PDF text extraction
- Resume and job description analysis using Google Gemini
- AI-generated resume match score from 0–100
- Matched skills
- Missing skills
- Strengths and weaknesses
- Improvement suggestions
- Analysis history
- User-specific resume access
- Protected resume file viewing
- Responsive React frontend
- REST API using Django REST Framework

## Tech Stack

### Backend

- Python
- Django
- Django REST Framework
- Simple JWT
- PyMuPDF
- Google Gemini API
- SQLite for local development
- PostgreSQL for production

### Frontend

- React
- Vite
- JavaScript
- React Router
- Fetch API
- CSS

### Deployment

- GitHub
- Render
- PostgreSQL

# API Endpoints

# Authentication
POST /api/register/
POST /api/login/
POST /api/token/refresh/

# Resumes
GET    /api/resumes/
POST   /api/resumes/
POST   /api/resumes/upload/
GET    /api/resumes/<id>/
DELETE /api/resumes/<id>/
GET    /api/resumes/<id>/view/

# Resume Analysis
POST /api/resumes/<id>/analyze/
GET  /api/resumes/<id>/analyses/
GET  /api/analyses/<id>/
DELETE /api/analyses/<id>/

# Dashboard
GET /api/dashboard/

# Local Setup

1. Clone the repository
    git clone https://github.com/YOUR_USERNAME/AI-Resume-Analyser.git
    cd AI-Resume-Analyser

2. Create virtual environment
    python -m venv venv

    # Activate it on Windows:
    venv\Scripts\activate

3. Install dependencies
    pip install -r requirements.txt

4. Create .env
    Create a .env file in the project root:

    GEMINI_API_KEY=your_gemini_api_key

    DEBUG=True

5. Run migrations
    python manage.py migrate

6. Start Django
    python manage.py runserver

# Backend: 
    http://127.0.0.1:8000

7. Start React

    Open another terminal:

    cd frontend
    npm install
    npm run dev

# Frontend:
    http://localhost:5173

# Environment Variables

    GEMINI_API_KEY
    DEBUG
    DATABASE_URL

# Security

    - JWT authentication is used for protected API endpoints.
    - Users can access only their own resumes and analyses.
    - Resume uploads are restricted to PDF files.
    - Resume file size is limited to 5 MB.
    - Each user can upload a maximum of 3 resumes.
    - Gemini API credentials are stored in environment variables.
    - .env is excluded from Git.

# AI Analysis

    The application sends the extracted resume text and the supplied job description to Google Gemini.

    The AI returns structured analysis containing:

    - Score
    - Matched Skills
    - Missing Skills
    - Strengths
    - Weaknesses
    - Suggestions

    The result is stored in the database and can be viewed later from the analysis history.