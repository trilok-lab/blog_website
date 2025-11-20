from django.urls import path
from .views import (
    ArticleListView, ArticleDetailView, ArticleCreateView, ArticleUpdateView,
    CategoryListCreateView, CategoryDetailView
)

urlpatterns = [
    # Article
    path("", ArticleListView.as_view(), name="article-list"),
    path("create/", ArticleCreateView.as_view(), name="article-create"),
    path("<slug:slug>/", ArticleDetailView.as_view(), name="article-detail"),
    path("<int:pk>/edit/", ArticleUpdateView.as_view(), name="article-edit"),
    
    # Category
    path("categories/", CategoryListCreateView.as_view(), name="category-list-create"),
    path("categories/<int:pk>/", CategoryDetailView.as_view(), name="category-detail"),
]
