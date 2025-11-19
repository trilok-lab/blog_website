import stripe
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from articles.models import Article

stripe.api_key = "YOUR_STRIPE_SECRET_KEY"

class CreateStripePaymentIntent(APIView):
    def post(self, request):
        data = request.data
        try:
            amount = int(data.get('amount', 1000))  # Default 10.00 USD
            intent = stripe.PaymentIntent.create(
                amount=amount,
                currency='usd',
                payment_method_types=['card'],
            )
            return Response({'client_secret': intent.client_secret})
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
