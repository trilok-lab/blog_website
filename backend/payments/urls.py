from django.urls import path
from .views import create_payment_intent

urlpatterns = [
    path("create-intent/", create_payment_intent, name="stripe-create-intent"),
]
