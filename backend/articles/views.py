from rest_framework import generics, permissions, filters
from rest_framework.pagination import PageNumberPagination
from .models import Article, Category
from .serializers import ArticleSerializer, CategorySerializer

class StandardResultsSetPagination(PageNumberPagination):
    page_size_query_param = 'page_size'

# ------------------------
# Article Views
# ------------------------
class ArticleListView(generics.ListAPIView):
    queryset = Article.objects.filter(approved=True).order_by('-created_at')
    serializer_class = ArticleSerializer
    pagination_class = StandardResultsSetPagination
    filter_backends = [filters.SearchFilter]
    search_fields = ['title', 'description']

class ArticleDetailView(generics.RetrieveAPIView):
    queryset = Article.objects.filter(approved=True)
    serializer_class = ArticleSerializer
    lookup_field = 'slug'

class ArticleCreateView(generics.CreateAPIView):
    serializer_class = ArticleSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user, approved=False)

# ------------------------
# Category Views
# ------------------------
class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class CategoryDetailView(generics.RetrieveAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    lookup_field = 'slug'
