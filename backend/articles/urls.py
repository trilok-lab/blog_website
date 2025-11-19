from django.urls import path
from .views import ArticleListView, ArticleDetailView, ArticleCreateView, CategoryListView, CategoryDetailView

app_name = 'articles'

urlpatterns = [
    path('', ArticleListView.as_view(), name='list'),
    path('create/', ArticleCreateView.as_view(), name='create'),
    path('<slug:slug>/', ArticleDetailView.as_view(), name='detail'),
    path('categories/', CategoryListView.as_view(), name='category-list'),
    path('categories/<slug:slug>/', CategoryDetailView.as_view(), name='category-detail'),
]
