# payments/views.py
import stripe
from django.conf import settings
from django.utils import timezone
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.db import transaction

from .models import Payment
from .serializers import CreateCheckoutSessionSerializer, PaymentSerializer

stripe.api_key = getattr(settings, "STRIPE_SECRET_KEY", None)
STRIPE_WEBHOOK_SECRET = getattr(settings, "STRIPE_WEBHOOK_SECRET", None)
DEFAULT_PAYMENT_CENTS = getattr(settings, "PAYMENT_AMOUNT_CENTS", 199)  # default 1.99 USD

@api_view(["POST"])
@permission_classes([AllowAny])
def create_checkout_session(request):
    """
    Create a Payment object and Stripe Checkout Session.

    Request (optional for guests):
    {
      "amount": 199,             # amount in cents (optional, defaults)
      "currency": "usd",
      "article_title": "Title"   # useful metadata for admin
    }

    Response:
    { "payment_id": <db id>, "session_id": "cs_...", "url": "https://checkout.stripe..." }
    """
    ser = CreateCheckoutSessionSerializer(data=request.data)
    ser.is_valid(raise_exception=True)
    data = ser.validated_data

    amount = data.get("amount") or DEFAULT_PAYMENT_CENTS
    currency = data.get("currency", "usd")
    article_title = data.get("article_title", "")

    user = request.user if request.user.is_authenticated else None

    # Create Payment row first (pending)
    payment = Payment.objects.create(
        user=user,
        amount=amount,
        currency=currency,
        status=Payment.STATUS_PENDING,
        metadata={"article_title": article_title, "initiated_by": user.id if user else "guest"}
    )

    # Create Checkout Session with metadata referencing payment.id for secure correlation
    try:
        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            mode="payment",
            line_items=[{
                "price_data": {
                    "currency": currency,
                    "product_data": {"name": "Article Submission Fee"},
                    "unit_amount": int(amount),
                },
                "quantity": 1,
            }],
            success_url=request.data.get("success_url") or request.build_absolute_uri("/payments/success/"),
            cancel_url=request.data.get("cancel_url") or request.build_absolute_uri("/payments/cancel/"),
            metadata={
                "payment_id": str(payment.id),
            },
        )
    except Exception as e:
        payment.mark_failed()
        return Response({"error": "Stripe session creation failed", "detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    # Save stripe session id on payment
    payment.stripe_session_id = session.id
    payment.save(update_fields=["stripe_session_id"])

    return Response({"payment_id": payment.id, "session_id": session.id, "url": session.url})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def list_my_payments(request):
    qs = Payment.objects.filter(user=request.user).order_by("-created_at")
    data = PaymentSerializer(qs, many=True).data
    return Response(data)


@api_view(["POST"])
@permission_classes([AllowAny])
def verify_payment(request):
    """
    Verify payment status by stripe_session_id or payment_id (but DO NOT mark used).
    Useful for client-side checks.

    Body:
    { "payment_id": <id> }  OR { "session_id": "cs_..." }

    Returns payment info (status).
    """
    payment_id = request.data.get("payment_id")
    session_id = request.data.get("session_id")
    if not payment_id and not session_id:
        return Response({"error": "payment_id or session_id required"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        if payment_id:
            payment = Payment.objects.get(id=payment_id)
        else:
            payment = Payment.objects.get(stripe_session_id=session_id)
    except Payment.DoesNotExist:
        return Response({"error": "Payment not found"}, status=status.HTTP_404_NOT_FOUND)

    return Response(PaymentSerializer(payment).data)


@api_view(["POST"])
@permission_classes([AllowAny])
def verify_and_consume(request):
    """
    Atomically verify payment is paid and mark as used.
    Body:
    { "payment_id": <id> }

    Response:
    { "ok": true, "payment_id": <id> }
    """
    payment_id = request.data.get("payment_id")
    if not payment_id:
        return Response({"error": "payment_id required"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # lock row for atomic update (select_for_update) when using transaction
        with transaction.atomic():
            p = Payment.objects.select_for_update().get(id=payment_id)
            if p.used:
                return Response({"error": "Payment already consumed"}, status=status.HTTP_400_BAD_REQUEST)
            if p.status != Payment.STATUS_PAID:
                return Response({"error": "Payment not completed"}, status=status.HTTP_400_BAD_REQUEST)
            # mark used
            p.used = True
            p.save(update_fields=["used"])
            return Response({"ok": True, "payment_id": p.id})
    except Payment.DoesNotExist:
        return Response({"error": "Payment not found"}, status=status.HTTP_404_NOT_FOUND)
