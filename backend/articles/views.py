from rest_framework import generics, filters
from rest_framework.permissions import IsAuthenticated, AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from .models import Article, Category
from .serializers import ArticleSerializer, CategorySerializer
from accounts.permissions import IsAdminUserCustom

# Category Views
class CategoryListCreateView(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAdminUserCustom]

class CategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAdminUserCustom]

    def perform_destroy(self, instance):
        if instance.articles.exists():
            raise Exception("Cannot delete category with articles")
        instance.delete()

# Article Views
class ArticleListView(generics.ListAPIView):
    queryset = Article.objects.filter(is_approved=True)
    serializer_class = ArticleSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["categories", "author"]
    search_fields = ["title", "content"]
    ordering_fields = ["created_at", "popularity"]

class ArticleDetailView(generics.RetrieveAPIView):
    queryset = Article.objects.filter(is_approved=True)
    serializer_class = ArticleSerializer
    permission_classes = [AllowAny]
    lookup_field = "slug"

class ArticleCreateView(generics.CreateAPIView):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user, is_approved=False)

class ArticleUpdateView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_admin:
            return Article.objects.all()
        return Article.objects.filter(author=user)
