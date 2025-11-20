from django.urls import path
from .views import CreateStripePaymentIntent, StripeWebhook

urlpatterns = [
    path("create-payment-intent/", CreateStripePaymentIntent.as_view(), name="create-payment-intent"),
    path("webhook/", StripeWebhook.as_view(), name="stripe-webhook"),
]
