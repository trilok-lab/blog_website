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
    """
    Public comment endpoints:

    - GET list → approved comments only (public)
    - GET retrieve → approved only (public)
    - POST create:
        • authenticated users
        • guests with OTP verification
    """

    queryset = Comment.objects.select_related("article", "user", "article__author")
    serializer_class = CommentSerializer
    permission_classes = [AllowAny]

    # --------------------------------------
    # LIST COMMENTS (PUBLIC, APPROVED ONLY)
    # --------------------------------------
    def list(self, request, *args, **kwargs):
        article_param = request.query_params.get("article")

        qs = Comment.objects.filter(approved=True)

        if article_param:
            if str(article_param).isdigit():
                qs = qs.filter(article_id=int(article_param))
            else:
                qs = qs.filter(article__slug=article_param)

        qs = qs.order_by("-created_at")
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

    # --------------------------------------
    # CREATE COMMENT (USER + GUEST)
    # --------------------------------------
    def perform_create(self, serializer):
        request = self.request
        data = request.data or {}
        user = request.user if request.user.is_authenticated else None

        # ==================================================
        # AUTHENTICATED USER FLOW
        # ==================================================
        if user:
            is_auto_approved = getattr(user, "is_admin", False)
            comment = serializer.save(
                user=user,
                approved=is_auto_approved,
            )

            # 🔔 Admin notification (pending approval)
            if not comment.approved:
                send_async_email(
                    subject="[Comment] New comment pending approval",
                    to_email=settings.DEFAULT_FROM_EMAIL,
                    text_content=f"New comment on article ID {comment.article_id}",
                    html_content=None,
                )

            # 📩 Author notification (PDF-required)
            article_author = comment.article.author
            if article_author and article_author.email:
                send_async_email(
                    subject="New comment on your article",
                    to_email=article_author.email,
                    text_content=(
                        f"Your article '{comment.article.title}' received a new comment.\n\n"
                        f"Comment:\n{comment.content}"
                    ),
                    html_content=None,
                )
            return

        # ==================================================
        # GUEST FLOW (OTP VERIFIED)
        # ==================================================
        verification_session_id = data.get("verification_session_id")
        guest_name = data.get("guest_name")
        guest_mobile = data.get("guest_mobile")

        if not verification_session_id:
            raise serializers.ValidationError({
                "verification_session_id": "Phone verification required."
            })

        if not guest_name:
            raise serializers.ValidationError({
                "guest_name": "Guest name is required."
            })

        if not guest_mobile:
            raise serializers.ValidationError({
                "guest_mobile": "Guest mobile number is required."
            })

        try:
            pv = PhoneVerification.objects.get(
                session_id=verification_session_id
            )
        except PhoneVerification.DoesNotExist:
            raise serializers.ValidationError({
                "verification_session_id": "Invalid verification session."
            })

        if pv.verified is not True:
            raise serializers.ValidationError({
                "verification_session_id": "Phone number not verified."
            })

        if pv.is_expired():
            raise serializers.ValidationError({
                "verification_session_id": "Verification session expired."
            })

        comment = serializer.save(
            user=None,
            guest_name=guest_name,
            guest_mobile=guest_mobile,
            approved=False,
        )

        # 🔔 Admin notification (guest comment)
        send_async_email(
            subject="[Comment] Guest comment pending approval",
            to_email=settings.DEFAULT_FROM_EMAIL,
            text_content=f"Guest comment on article ID {comment.article_id}",
            html_content=None,
        )

        # 📩 Author notification (PDF-required)
        article_author = comment.article.author
        if article_author and article_author.email:
            send_async_email(
                subject="New comment on your article",
                to_email=article_author.email,
                text_content=(
                    f"Your article '{comment.article.title}' received a new comment.\n\n"
                    f"Comment:\n{comment.content}"
                ),
                html_content=None,
            )

    # --------------------------------------
    # OPTIONAL: BY ARTICLE SLUG
    # --------------------------------------
    @action(detail=False, methods=["get"], url_path="by-article")
    def by_article(self, request):
        slug = request.query_params.get("slug")

        if not slug:
            return Response(
                {"detail": "slug required"},
                status=400
            )

        comments = Comment.objects.filter(
            article__slug=slug,
            approved=True
        ).order_by("-created_at")

        serializer = self.get_serializer(comments, many=True)
        return Response(serializer.data)
