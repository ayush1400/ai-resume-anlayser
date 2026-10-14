from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from django.shortcuts import get_object_or_404

from .models import Resume, ResumeAnalysis
from .serializers import ResumeSerializer, ResumeAnalysisSerializer
from .utils import extract_text_from_pdf
from .ai_service import analyze_resume
from django.http import FileResponse

class ResumeListCreateView(APIView):

    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get(self, request):

        resumes = Resume.objects.filter(user=request.user).order_by('-uploaded_at')
        serializer = ResumeSerializer(resumes,many=True,context={'request': request})
        return Response(serializer.data)

    def post(self, request):

        resume_count = Resume.objects.filter(user=request.user).count()

        if resume_count >= 3:
           return Response({"error": "You can upload a maximum of 3 resumes."},status=status.HTTP_400_BAD_REQUEST)

        serializer = ResumeSerializer(data=request.data,context={'request': request})

        if serializer.is_valid():
            pdf_file = request.FILES.get('file')

            extracted_text = ""

            if pdf_file:
                extracted_text = extract_text_from_pdf(pdf_file)

            resume = serializer.save(user=request.user,extracted_text=extracted_text)

            return Response(ResumeSerializer(resume, context={'request': request}).data,status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ResumeDetailView(APIView):

    permission_classes = [IsAuthenticated]

    def get_object(self, request, pk):
        return get_object_or_404(Resume, pk=pk, user=request.user)

    def get(self, request, pk):
        resume = self.get_object(request, pk)

        serializer = ResumeSerializer(resume, context={'request': request})

        return Response(serializer.data)

    def delete(self, request, pk):
        resume = self.get_object(request, pk)

        resume.delete()

        return Response({"message": "Resume deleted successfully"}, status=status.HTTP_200_OK)


class ResumeUploadView(APIView):

    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get_serializer(self, *args, **kwargs):
        return ResumeSerializer(*args, **kwargs, context={'request': self.request})


    def post(self, request):

        resume_count = Resume.objects.filter(user=request.user).count()

        if resume_count >= 3:
            return Response({"error": "You can upload a maximum of 3 resumes."},status=status.HTTP_400_BAD_REQUEST)

        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            pdf_file = request.FILES.get('file')

            extracted_text = ""

            if pdf_file:
                extracted_text = extract_text_from_pdf(pdf_file)

            resume = serializer.save(user=request.user,extracted_text=extracted_text)

            return Response(ResumeSerializer(resume,context={'request': request}).data,status=status.HTTP_201_CREATED)

        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    
class ResumeAnalysisView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request, pk):

        resume = get_object_or_404(Resume, pk=pk, user=request.user)

        job_description = request.data.get("job_description","").strip()

        if not job_description:
            return Response({"error": "Job description is required."},status=status.HTTP_400_BAD_REQUEST)

        if len(job_description) < 20:
            return Response(
                {
                    "error": (
                        "Job description must be at least "
                        "20 characters."
                    )
                },status=status.HTTP_400_BAD_REQUEST)

        if not resume.extracted_text:
            return Response({"error": "Resume text could not be extracted."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            result = analyze_resume(resume.extracted_text, job_description)

            analysis_result = result.model_dump()

            analysis = ResumeAnalysis.objects.create(
                resume=resume,
                job_description=job_description,
                score=result.score,
                analysis_result=analysis_result
            )

            return Response(
                ResumeAnalysisSerializer(analysis).data, status=status.HTTP_201_CREATED)

        except Exception:
            return Response(
                {
                    "error": (
                        "Unable to analyze the resume right now. "
                        "Please try again later."
                    )
                },
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )


class ResumeAnalysisListView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request, pk):

        # Only allow analyses belonging to the
        # logged-in user's resume.
        resume = get_object_or_404(Resume, pk=pk, user=request.user)

        analyses = ResumeAnalysis.objects.filter(resume=resume).order_by('-created_at')

        serializer = ResumeAnalysisSerializer(analyses, many=True)

        return Response(serializer.data)


class ResumeAnalysisDetailView(APIView):

    permission_classes = [IsAuthenticated]

    def get_object(self, request, pk):

        return get_object_or_404(ResumeAnalysis,pk=pk, resume__user=request.user)

    def get(self, request, pk):

        analysis = self.get_object(request, pk)

        serializer = ResumeAnalysisSerializer(analysis)

        return Response(serializer.data)

    def delete(self, request, pk):

        analysis = self.get_object(request, pk)

        analysis.delete()

        return Response({"message": "Analysis deleted successfully."}, status=status.HTTP_200_OK)


class DashboardView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        resumes = Resume.objects.filter(user=request.user)

        analyses = ResumeAnalysis.objects.filter(resume__user=request.user)

        latest_resume = resumes.order_by('-uploaded_at').first()

        latest_analysis = analyses.order_by('-created_at').first()

        return Response({
            "total_resumes": resumes.count(),
            "total_analyses": analyses.count(),

            "latest_resume": (
                ResumeSerializer(
                    latest_resume,
                    context={'request': request}
                ).data
                if latest_resume
                else None
            ),

            "latest_analysis": (
                ResumeAnalysisSerializer(
                    latest_analysis
                ).data
                if latest_analysis
                else None
            )
        })


class ResumeViewFileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):

        resume = get_object_or_404(Resume, pk=pk, user=request.user)

        if not resume.file:

            return Response({"error": "Resume file not found."}, status=status.HTTP_404_NOT_FOUND)

        try:
            resume.file.open("rb")

            return FileResponse(resume.file, content_type="application/pdf")

        except Exception:
            return Response({"error": "Unable to open resume file."}, status=status.HTTP_404_NOT_FOUND)