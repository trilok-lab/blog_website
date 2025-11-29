# admin_features/views.py
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated

from articles.models import Article, Category
from comments.models import Comment

from .serializers import AdminCategorySerializer, AdminArticleSerializer
from comments.serializers import CommentSerializer
from .permissions import IsAdminUserStrict


class AdminArticleViewSet(viewsets.ModelViewSet):
    """
    Admin-only Article CRUD + Approve/Reject
    Uses AdminArticleSerializer so admin can fully edit articles.
    """
    queryset = Article.objects.all().order_by("-created_at")
    serializer_class = AdminArticleSerializer
    permission_classes = [IsAuthenticated, IsAdminUserStrict]

    @action(detail=True, methods=["post"])
    def approve(self, request, pk=None):
        article = self.get_object()
        article.is_approved = True
        article.save(update_fields=["is_approved"])
        return Response(
            {"detail": "Article approved", "article": AdminArticleSerializer(article).data},
            status=status.HTTP_200_OK,
        )

    @action(detail=True, methods=["post"])
    def reject(self, request, pk=None):
        article = self.get_object()
        article.is_approved = False
        article.save(update_fields=["is_approved"])
        return Response(
            {"detail": "Article rejected", "article": AdminArticleSerializer(article).data},
            status=status.HTTP_200_OK,
        )


class AdminCategoryViewSet(viewsets.ModelViewSet):
    """
    Admin CRUD for categories.
    """
    queryset = Category.objects.all().order_by("name")
    serializer_class = AdminCategorySerializer
    permission_classes = [IsAuthenticated, IsAdminUserStrict]


class AdminCommentViewSet(viewsets.ModelViewSet):
    """
    Admin comment moderation.
    """
    queryset = Comment.objects.all().order_by("-created_at")
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated, IsAdminUserStrict]

    @action(detail=False, methods=["get"], url_path="unapproved")
    def unapproved(self, request):
        qs = Comment.objects.filter(approved=False).order_by("-created_at")
        return Response(CommentSerializer(qs, many=True).data)

    @action(detail=True, methods=["post"])
    def approve(self, request, pk=None):
        comment = self.get_object()
        comment.approved = True
        comment.save(update_fields=["approved"])
        return Response({"detail": "Comment approved"})

    @action(detail=True, methods=["post"], url_path="reject")
    def reject(self, request, pk=None):
        comment = self.get_object()
        comment.delete()
        return Response({"detail": "Comment rejected"})
