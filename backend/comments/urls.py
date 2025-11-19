from django.urls import path
from .views import CommentListView, CommentCreateView

urlpatterns = [
    path('comments/', CommentListView.as_view(), name='list'),
    path('comments/create/', CommentCreateView.as_view(), name='create'),
]
