from django.urls import path, include
from .views import request_phone_code, verify_phone_code, register, mobile_complete

urlpatterns = [
    path('request-phone-code/', request_phone_code, name='request-phone-code'),
    path('verify-phone-code/', verify_phone_code, name='verify-phone-code'),
    path('register/', register, name='register'),
    path('mobile-complete/', mobile_complete, name='mobile-complete'),
    path('', include('social_django.urls', namespace='social')),
]


