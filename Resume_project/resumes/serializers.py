from rest_framework import serializers
from .models import Resume, ResumeAnalysis

class ResumeSerializer(serializers.ModelSerializer):

    file_url = serializers.SerializerMethodField()

    class Meta:
        model = Resume
        fields = [ 'id', 'title', 'file', 'file_url', 'uploaded_at',]
        read_only_fields = ['id', 'uploaded_at', 'file_url',]

    def get_file_url(self, obj):
        request = self.context.get('request')

        if obj.file:
            url = obj.file.url

            if request:
                return request.build_absolute_uri(url)

            return url

        return None

    def validate_file(self, value):
        if not value.name.lower().endswith('.pdf'):
            raise serializers.ValidationError("Only PDF files are allowed.")

        max_size = 5 * 1024 * 1024

        if value.size > max_size:
            raise serializers.ValidationError("File size must not exceed 5 MB.")

        return value


class ResumeAnalysisSerializer(serializers.ModelSerializer):

    class Meta:
        model = ResumeAnalysis
        fields = ['id','resume','job_description','score','analysis_result','created_at',]

        read_only_fields = ['id','resume','score','analysis_result','created_at',]