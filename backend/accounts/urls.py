from django.urls import path, include
from . import views

urlpatterns = [
    path('request-phone-code/', views.RequestPhoneCodeView.as_view(), name='request-phone-code'),
    path('verify-phone-code/', views.VerifyPhoneCodeView.as_view(), name='verify-phone-code'),
    path('register/', views.RegisterView.as_view(), name='register'),
    path('mobile-complete/', views.mobile_complete, name='mobile-complete'),
    path('', include('social_django.urls', namespace='social')),
]
