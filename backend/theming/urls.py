# theming/urls.py
from django.urls import path
from .views import get_theme, set_theme

urlpatterns = [
    path("setting/", get_theme, name="get-theme"),
    path("setting/change/", set_theme, name="set-theme"),
]
