# comments/views.py

from rest_framework import viewsets, serializers
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import action

from django.utils import timezone

from .models import Comment
from .serializers import CommentSerializer
from accounts.models import PhoneVerification
from articles.models import Article


class CommentViewSet(viewsets.ModelViewSet):
    """
    Public comment endpoints:
    - GET list (approved only)
    - POST create (guest or signed-in user)
    - GET retrieve
    Update/delete => admin only (handled elsewhere)
    """

    queryset = Comment.objects.select_related("article", "user")
    serializer_class = CommentSerializer

    # ✅ PUBLIC READ, AUTH WRITE
    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            return [AllowAny()]
        return [IsAuthenticated()]

    # --------------------------------------
    # LIST COMMENTS (PUBLIC)
    # --------------------------------------
    def list(self, request, *args, **kwargs):
        """
        GET /api/comments/?article=<id or slug>
        Returns approved comments only.
        """
        article_param = request.query_params.get("article")

        qs = Comment.objects.filter(approved=True)

        if article_param:
            # ✅ SAFE: detect numeric ID vs slug
            if str(article_param).isdigit():
                qs = qs.filter(article_id=int(article_param))
            else:
                qs = qs.filter(article__slug=article_param)

        qs = qs.order_by("-created_at")

        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

    # --------------------------------------
    # CREATE COMMENT (AUTH ONLY)
    # --------------------------------------
    def perform_create(self, serializer):
        user = self.request.user if self.request.user.is_authenticated else None

        if user:
            is_auto_approved = getattr(user, "is_admin", False)
            serializer.save(user=user, approved=is_auto_approved)
            return

        # ❌ Guests cannot post comments anymore
        raise serializers.ValidationError(
            {"detail": "Login required to post a comment"}
        )

    # --------------------------------------
    # OPTIONAL: helper endpoint
    # --------------------------------------
    @action(detail=False, methods=["get"], url_path="by-article")
    def by_article(self, request):
        """
        GET /api/comments/by-article/?slug=xxx
        """
        slug = request.query_params.get("slug")
        if not slug:
            return Response({"detail": "slug required"}, status=400)

        comments = Comment.objects.filter(
            article__slug=slug,
            approved=True
        ).order_by("-created_at")

        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data)
