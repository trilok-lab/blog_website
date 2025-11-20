from django.urls import path
from .views import RegisterView, VerifyMobileView

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("verify-mobile/", VerifyMobileView.as_view(), name="verify-mobile"),
]
