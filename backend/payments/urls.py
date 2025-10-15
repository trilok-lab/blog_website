from django.urls import path
from .views import create_checkout_session, verify_checkout_session

urlpatterns = [
    path('checkout-session/', create_checkout_session, name='create-checkout-session'),
    path('verify-session/', verify_checkout_session, name='verify-checkout-session'),
]


