# contact/urls.py
from django.urls import path
from .views import ContactCreateView, ContactListAdminView, ContactReadUpdateView

urlpatterns = [
    path("submit/", ContactCreateView.as_view(), name="contact-submit"),
    path("admin/list/", ContactListAdminView.as_view(), name="contact-admin-list"),
    path("<int:pk>/read/", ContactReadUpdateView.as_view(), name="contact-read-update"),
]
