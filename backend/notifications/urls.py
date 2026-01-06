# notifications/urls.py

from django.urls import path
from .views import (
    NotificationListView,
    NotificationMarkReadView,
    NotificationUnreadCountView,
)

urlpatterns = [
    path("", NotificationListView.as_view(), name="notifications-list"),
    path("unread-count/", NotificationUnreadCountView.as_view(), name="notifications-unread-count"),
    path("<int:pk>/read/", NotificationMarkReadView.as_view(), name="notification-mark-read"),
]
