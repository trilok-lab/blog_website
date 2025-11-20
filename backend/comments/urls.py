from django.urls import path
from .views import CommentListCreateView, CommentApproveView

urlpatterns = [
    path("", CommentListCreateView.as_view(), name="comment-list-create"),
    path("<int:pk>/approve/", CommentApproveView.as_view(), name="comment-approve"),
]
