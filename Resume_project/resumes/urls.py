from django.urls import path

from .views import (
    ResumeListCreateView,
    ResumeUploadView,
    ResumeDetailView,
    ResumeAnalysisView,
    ResumeAnalysisListView,
    ResumeAnalysisDetailView,
    DashboardView,
    ResumeViewFileView
)

urlpatterns = [
    path('resumes/', ResumeListCreateView.as_view(), name='resume-list-create'),
    path('resumes/upload/', ResumeUploadView.as_view(), name='resume-upload'),
    path('resumes/<int:pk>/', ResumeDetailView.as_view(), name='resume-detail'),
    path('resumes/<int:pk>/analyze/', ResumeAnalysisView.as_view(), name='resume-analyze'),
    path('resumes/<int:pk>/analyses/', ResumeAnalysisListView.as_view(), name='resume-analysis-list'),
    path('analyses/<int:pk>/', ResumeAnalysisDetailView.as_view(), name='resume-analysis-detail'),
    path('dashboard/', DashboardView.as_view(), name='dashboard'),
    path('resumes/<int:pk>/view/', ResumeViewFileView.as_view(), name='resume-view-file'),
]