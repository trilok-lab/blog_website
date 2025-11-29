# payments/urls.py
from django.urls import path
from .views import create_checkout_session, list_my_payments, verify_payment, verify_and_consume
from .webhook import stripe_webhook

urlpatterns = [
    path("checkout-session/", create_checkout_session, name="create-checkout-session"),
    path("verify/", verify_payment, name="verify-payment"),
    path("verify-and-consume/", verify_and_consume, name="verify-and-consume"),
    path("webhook/", stripe_webhook, name="stripe-webhook"),
    path("my-payments/", list_my_payments, name="my-payments"),
]
