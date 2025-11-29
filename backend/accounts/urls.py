# accounts/urls.py
from django.urls import path
from .views import (
    RequestPhoneCodeView, ResendPhoneCodeView, VerifyPhoneCodeView,
    RegisterView, LoginView, profile_view
)

urlpatterns = [
    path("request-phone-code/", RequestPhoneCodeView.as_view(), name="request-phone-code"),
    path("resend-phone-code/", ResendPhoneCodeView.as_view(), name="resend-phone-code"),
    path("verify-phone-code/", VerifyPhoneCodeView.as_view(), name="verify-phone-code"),
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),
    path("profile/", profile_view, name="profile"),
]
