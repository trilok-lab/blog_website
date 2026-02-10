# backend/comments/views.py

from rest_framework import viewsets, serializers
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.decorators import action
from django.conf import settings

from .models import Comment
from .serializers import CommentSerializer
from accounts.models import PhoneVerification
from notifications.emails import send_async_email


class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.select_related("article", "user", "article__author")
    serializer_class = CommentSerializer
    permission_classes = [AllowAny]

    def list(self, request, *args, **kwargs):
        article_param = request.query_params.get("article")
        qs = Comment.objects.filter(approved=True)

        if article_param:
            qs = qs.filter(article__slug=article_param) if not article_param.isdigit() else qs.filter(article_id=int(article_param))

        serializer = self.get_serializer(qs.order_by("-created_at"), many=True)
        return Response(serializer.data)

    def perform_create(self, serializer):
        request = self.request
        data = request.data or {}
        user = request.user if request.user.is_authenticated else None

        # =========================
        # LOGGED-IN USER
        # =========================
        if user:
            comment = serializer.save(
                user=user,
                approved=True,
            )

            article_author = comment.article.author
            if article_author and article_author.email:
                send_async_email(
                    subject="New comment on your article",
                    to_email=article_author.email,
                    text_content=f"Comment:\n{comment.content}",
                    html_content=None,
                )
            return

        # =========================
        # GUEST USER
        # =========================
        verification_session_id = data.get("verification_session_id")

        if not verification_session_id:
            raise serializers.ValidationError({"verification_session_id": "Phone verification required."})

        try:
            pv = PhoneVerification.objects.get(session_id=verification_session_id)
        except PhoneVerification.DoesNotExist:
            raise serializers.ValidationError({"verification_session_id": "Invalid verification session."})

        if not pv.verified or pv.is_expired():
            raise serializers.ValidationError({"verification_session_id": "Phone not verified or expired."})

        comment = serializer.save(approved=False)

        send_async_email(
            subject="[Comment] Guest comment pending approval",
            to_email=settings.DEFAULT_FROM_EMAIL,
            text_content=f"Guest comment on article ID {comment.article_id}",
            html_content=None,
        )

        article_author = comment.article.author
        if article_author and article_author.email:
            send_async_email(
                subject="New comment on your article",
                to_email=article_author.email,
                text_content=f"Comment:\n{comment.content}",
                html_content=None,
            )

    @action(detail=False, methods=["get"], url_path="by-article")
    def by_article(self, request):
        slug = request.query_params.get("slug")
        if not slug:
            return Response({"detail": "slug required"}, status=400)

        qs = Comment.objects.filter(article__slug=slug, approved=True).order_by("-created_at")
        return Response(self.get_serializer(qs, many=True).data)
