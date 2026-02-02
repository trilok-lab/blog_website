# backend/payments/urls.py

from django.urls import path
from .views import (
    create_checkout_session,
    list_my_payments,
    verify_payment,
    verify_and_consume,
    payment_success,
)
from .webhook import stripe_webhook

urlpatterns = [
    path("checkout-session/", create_checkout_session, name="create-checkout-session"),
    path("my-payments/", list_my_payments, name="my-payments"),
    path("verify/", verify_payment, name="verify-payment"),
    path("verify-and-consume/", verify_and_consume, name="verify-and-consume"),
    path("webhook/", stripe_webhook, name="stripe-webhook"),
    path("success/", payment_success, name="payment-success"),
]
