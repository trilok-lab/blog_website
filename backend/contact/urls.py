from django.urls import path
from .views import ContactCreateView, ContactListView, ContactUpdateView

urlpatterns = [
    path("", ContactCreateView.as_view(), name="contact-create"),
    path("admin/list/", ContactListView.as_view(), name="contact-list"),
    path("<int:pk>/update/", ContactUpdateView.as_view(), name="contact-update"),
]
