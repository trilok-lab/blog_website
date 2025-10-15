from django.urls import path
from .views import theme_setting

urlpatterns = [
    path('setting/', theme_setting, name='theme-setting'),
]


