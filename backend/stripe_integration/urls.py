from django.urls import path
from .views import CreateStripePaymentIntent

urlpatterns = [
    path('create-payment-intent/', CreateStripePaymentIntent.as_view(), name='create-payment-intent'),
]
