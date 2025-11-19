from django.urls import path
from .views import ContactCreateView

urlpatterns = [
    path('submit/', ContactCreateView.as_view(), name='submit'),
]
