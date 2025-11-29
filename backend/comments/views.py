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
    Update/delete => admin only (handled in admin_features)
    """

    queryset = Comment.objects.select_related("article", "user").all()
    serializer_class = CommentSerializer

    def get_permissions(self):
        if self.action in ["list", "retrieve", "create"]:
            return [AllowAny()]
        return [IsAuthenticated()]

    # --------------------------------------
    # LIST COMMENTS (public)
    # --------------------------------------
    def list(self, request, *args, **kwargs):
        """
        GET /api/comments/?article=<id or slug>
        Returns approved comments only.
        """
        article_id_or_slug = request.query_params.get("article")

        qs = Comment.objects.filter(approved=True)

        if article_id_or_slug:
            # Try slug first, then pk
            qs = qs.filter(article__slug=article_id_or_slug) | qs.filter(article_id=article_id_or_slug)

        serializer = self.get_serializer(qs.order_by("-created_at"), many=True)
        return Response(serializer.data)

    # --------------------------------------
    # CREATE COMMENT (guest or signed in)
    # --------------------------------------
    def perform_create(self, serializer):
        user = self.request.user if self.request.user.is_authenticated else None

        if user:  
            # Admin auto approves, normal users need approval
            is_auto_approved = getattr(user, "is_admin", False)
            serializer.save(user=user, approved=is_auto_approved)
            return

        # Guest submission
        session_id = self.request.data.get("verification_session_id")
        if not session_id:
            raise serializers.ValidationError({"detail": "Phone verification required for guest comments"})

        try:
            pv = PhoneVerification.objects.get(session_id=session_id)
        except PhoneVerification.DoesNotExist:
            raise serializers.ValidationError({"detail": "Invalid verification session"})

        if not pv.verified or pv.is_expired():
            raise serializers.ValidationError({"detail": "Phone not verified or expired"})

        # Mobile must match guest_mobile (if provided)
        guest_mobile = self.request.data.get("guest_mobile")
        if guest_mobile and guest_mobile != pv.mobile_no:
            raise serializers.ValidationError({"detail": "Guest mobile must match verified number"})

        serializer.save(
            user=None,
            guest_name=self.request.data.get("guest_name"),
            guest_mobile=pv.mobile_no,
            approved=False   # guest comments require admin approval
        )

    # --------------------------------------
    # OPTIONAL: helper endpoints for mobile client
    # --------------------------------------
    @action(detail=False, methods=["get"], url_path="by-article")
    def by_article(self, request):
        """
        GET /api/comments/by-article/?slug=xxx
        """
        slug = request.query_params.get("slug")
        if not slug:
            return Response({"detail": "slug required"}, status=400)
        comments = Comment.objects.filter(article__slug=slug, approved=True)
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data)
