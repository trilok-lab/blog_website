# backend/payments/views.py

import stripe
from django.conf import settings
from django.utils import timezone
from django.http import HttpResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.db import transaction

from .models import Payment
from .serializers import CreateCheckoutSessionSerializer, PaymentSerializer

stripe.api_key = getattr(settings, "STRIPE_SECRET_KEY", None)
DEFAULT_PAYMENT_CENTS = getattr(settings, "PAYMENT_AMOUNT_CENTS", 199)


# =========================
# CREATE CHECKOUT SESSION
# =========================
@api_view(["POST"])
@permission_classes([AllowAny])
def create_checkout_session(request):
    ser = CreateCheckoutSessionSerializer(data=request.data)
    ser.is_valid(raise_exception=True)
    data = ser.validated_data

    amount = data.get("amount") or DEFAULT_PAYMENT_CENTS
    currency = data.get("currency", "usd")
    article_title = data.get("article_title", "")

    user = request.user if request.user.is_authenticated else None

    payment = Payment.objects.create(
        user=user,
        amount=amount,
        currency=currency,
        status=Payment.STATUS_PENDING,
        metadata={
            "article_title": article_title,
            "initiated_by": user.id if user else "guest",
        },
    )

    try:
        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            mode="payment",
            line_items=[
                {
                    "price_data": {
                        "currency": currency,
                        "product_data": {"name": "Article Submission Fee"},
                        "unit_amount": int(amount),
                    },
                    "quantity": 1,
                }
            ],
            success_url=request.build_absolute_uri("/payments/success/"),
            cancel_url=request.build_absolute_uri("/payments/cancel/"),
            metadata={"payment_id": str(payment.id)},
        )
    except Exception as e:
        payment.status = Payment.STATUS_FAILED
        payment.save(update_fields=["status"])
        return Response(
            {"error": "Stripe session creation failed", "detail": str(e)},
            status=status.HTTP_400_BAD_REQUEST,
        )

    payment.stripe_session_id = session.id
    payment.save(update_fields=["stripe_session_id"])

    return Response(
        {
            "payment_id": payment.id,
            "session_id": session.id,
            "url": session.url,
        }
    )


# =========================
# LIST MY PAYMENTS
# =========================
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def list_my_payments(request):
    qs = Payment.objects.filter(user=request.user).order_by("-created_at")
    return Response(PaymentSerializer(qs, many=True).data)


# =========================
# VERIFY PAYMENT (READ ONLY)
# =========================
@api_view(["POST"])
@permission_classes([AllowAny])
def verify_payment(request):
    payment_id = request.data.get("payment_id")
    session_id = request.data.get("session_id")

    if not payment_id and not session_id:
        return Response(
            {"error": "payment_id or session_id required"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        payment = (
            Payment.objects.get(id=payment_id)
            if payment_id
            else Payment.objects.get(stripe_session_id=session_id)
        )
    except Payment.DoesNotExist:
        return Response({"error": "Payment not found"}, status=status.HTTP_404_NOT_FOUND)

    return Response(PaymentSerializer(payment).data)


# =========================
# VERIFY + CONSUME (OPTIONAL / BACKEND USE)
# =========================
@api_view(["POST"])
@permission_classes([AllowAny])
def verify_and_consume(request):
    payment_id = request.data.get("payment_id")
    if not payment_id:
        return Response(
            {"error": "payment_id required"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        with transaction.atomic():
            payment = Payment.objects.select_for_update().get(id=payment_id)

            if payment.used:
                return Response(
                    {"error": "Payment already consumed"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            if payment.status != Payment.STATUS_PAID:
                return Response(
                    {"error": "Payment not completed"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            payment.used = True
            payment.save(update_fields=["used"])

            return Response({"ok": True, "payment_id": payment.id})

    except Payment.DoesNotExist:
        return Response({"error": "Payment not found"}, status=status.HTTP_404_NOT_FOUND)


# =========================
# SUCCESS PAGE (DUMMY UI)
# =========================
def payment_success(request):
    return HttpResponse(
        """
        <!DOCTYPE html>
        <html>
          <head>
            <title>Payment Successful</title>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
          </head>
          <body style="font-family: sans-serif; text-align:center; padding:40px;">
            <h2>✅ Payment Successful</h2>
            <p>Your payment has been received.</p>
            <p>You can safely return to the app.</p>

            <a href="exp://"
               style="
                 display:inline-block;
                 padding:14px 20px;
                 background:#22c55e;
                 color:white;
                 text-decoration:none;
                 border-radius:10px;
                 font-weight:600;
                 margin-top:20px;
               ">
              Return to App
            </a>
          </body>
        </html>
        """,
        content_type="text/html",
    )
