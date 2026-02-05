# backend/comments/serializers.py

from rest_framework import serializers
from .models import Comment


class CommentSerializer(serializers.ModelSerializer):
    article_title = serializers.CharField(
        source="article.title",
        read_only=True
    )
    user_name = serializers.CharField(
        source="user.username",
        read_only=True
    )

    # helper field (same pattern as guest article)
    verification_session_id = serializers.CharField(
        write_only=True,
        required=False,
        allow_null=True,
        allow_blank=True,
    )

    class Meta:
        model = Comment
        fields = [
            "id",
            "article",
            "article_title",
            "user",
            "user_name",
            "guest_name",
            "guest_mobile",
            "content",
            "approved",
            "created_at",
            "verification_session_id",
        ]
        read_only_fields = [
            "approved",
            "user",
            "user_name",
            "article_title",
            "created_at",
        ]

    def create(self, validated_data):
        # remove helper-only field
        validated_data.pop("verification_session_id", None)
        return super().create(validated_data)
