# accounts/urls.py

from django.urls import path
from .views import (
    RequestPhoneCodeView,
    ResendPhoneCodeView,
    VerifyPhoneCodeView,
    RegisterView,
    LoginView,
    SocialLoginView,
    profile_view,
)

urlpatterns = [
    path("request-phone-code/", RequestPhoneCodeView.as_view()),
    path("resend-phone-code/", ResendPhoneCodeView.as_view()),
    path("verify-phone-code/", VerifyPhoneCodeView.as_view()),
    path("register/", RegisterView.as_view()),
    path("login/", LoginView.as_view()),
    path("social/", SocialLoginView.as_view()),
    path("profile/", profile_view),
]
