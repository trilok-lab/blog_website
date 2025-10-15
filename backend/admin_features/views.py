from rest_framework import viewsets, decorators, response, status
from rest_framework.permissions import IsAuthenticated
from articles.models import Article
from articles.serializers import ArticleSerializer


class AdminArticleViewSet(viewsets.ModelViewSet):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
    permission_classes = [IsAuthenticated]

    @decorators.action(detail=True, methods=["post"], url_path="approve")
    def approve(self, request, pk=None):
        article = self.get_object()
        article.approved = True
        article.save(update_fields=["approved"])
        return response.Response(ArticleSerializer(article).data, status=status.HTTP_200_OK)

# Create your views here.
