from rest_framework import serializers
from .models import Comment


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = [
            "id",
            "article",
            "user",
            "author_name",
            "author_mobile",
            "body",
            "approved",
            "created_at",
        ]
        read_only_fields = ["approved", "user"]

