# admin_features/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    AdminArticleViewSet,
    AdminCategoryViewSet,
    AdminCommentViewSet,
)

router = DefaultRouter()
router.register(r'articles', AdminArticleViewSet, basename='admin-articles')
router.register(r'categories', AdminCategoryViewSet, basename='admin-categories')
router.register(r'comments', AdminCommentViewSet, basename='admin-comments')

urlpatterns = [
    path('', include(router.urls)),
]
