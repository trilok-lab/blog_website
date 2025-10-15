from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AdminArticleViewSet

router = DefaultRouter()
router.register(r'articles', AdminArticleViewSet, basename='admin-articles')

urlpatterns = [
    path('', include(router.urls)),
]


