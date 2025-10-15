from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
import stripe


@api_view(["POST"])
def create_checkout_session(request):
    stripe.api_key = settings.STRIPE_SECRET_KEY
    # Minimal stub; client completes payment via Stripe Checkout
    try:
        session = stripe.checkout.Session.create(
            mode="payment",
            line_items=[{
                "price_data": {
                    "currency": "usd",
                    "product_data": {"name": "Article Submission Fee"},
                    "unit_amount": 199,
                },
                "quantity": 1,
            }],
            success_url="https://example.com/success",
            cancel_url="https://example.com/cancel",
        )
        return Response({"id": session.id, "url": session.url})
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
def verify_checkout_session(request):
    stripe.api_key = settings.STRIPE_SECRET_KEY
    session_id = (request.data or {}).get("session_id")
    if not session_id:
        return Response({"error": "session_id is required"}, status=status.HTTP_400_BAD_REQUEST)
    try:
        session = stripe.checkout.Session.retrieve(session_id)
        if session.get("payment_status") == "paid":
            return Response({"paid": True})
        return Response({"paid": False}, status=status.HTTP_402_PAYMENT_REQUIRED)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

# Create your views here.
