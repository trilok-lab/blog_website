import stripe
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from articles.models import Article
from django.shortcuts import get_object_or_404

stripe.api_key = settings.STRIPE_SECRET_KEY

class CreateStripePaymentIntent(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """
        Create a Stripe PaymentIntent for article submission.
        Frontend sends `amount` (in cents) and `article_title`.
        """
        data = request.data
        amount = data.get("amount")
        article_title = data.get("article_title")

        if not amount or not article_title:
            return Response({"error": "amount and article_title required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            payment_intent = stripe.PaymentIntent.create(
                amount=int(amount),
                currency="usd",
                metadata={"article_title": article_title, "user_id": request.user.id},
            )
            return Response({"client_secret": payment_intent.client_secret})
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

@method_decorator(csrf_exempt, name='dispatch')
class StripeWebhook(APIView):
    """
    Handle Stripe Webhook events.
    """
    def post(self, request):
        payload = request.body
        sig_header = request.META.get("HTTP_STRIPE_SIGNATURE")
        event = None

        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
            )
        except ValueError:
            return Response(status=400)
        except stripe.error.SignatureVerificationError:
            return Response(status=400)

        # Handle the event
        if event['type'] == 'payment_intent.succeeded':
            payment_intent = event['data']['object']
            user_id = payment_intent['metadata']['user_id']
            article_title = payment_intent['metadata']['article_title']

            # Optionally, create a placeholder article marked as paid
            Article.objects.create(
                title=article_title,
                created_by_id=user_id,
                is_paid=True
            )
        return Response(status=200)
