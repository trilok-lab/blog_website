from rest_framework import serializers
from .models import Comment

class CommentSerializer(serializers.ModelSerializer):
    article_title = serializers.CharField(source='article.title', read_only=True)
    user_name = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Comment
        fields = [
            "id", "article", "article_title", "user", "user_name",
            "guest_name", "guest_mobile", "content", "is_approved", "created_at"
        ]
        read_only_fields = ["is_approved", "created_at", "user_name", "article_title"]
