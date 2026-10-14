from django.db import models
from django.contrib.auth.models import User

class Resume(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE,related_name='resumes')
    title = models.CharField(max_length=255)
    file = models.FileField(upload_to='resumes/')
    extracted_text = models.TextField(blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.title}"


class ResumeAnalysis(models.Model):
    resume = models.ForeignKey(Resume,on_delete=models.CASCADE,related_name='analyses')
    job_description = models.TextField()
    score = models.IntegerField()
    analysis_result = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.resume.title} - Score: {self.score}"

