# payments/webhook.py

import stripe
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from django.http import HttpResponse
from django.utils import timezone

from .models import Payment

stripe.api_key = settings.STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET = settings.STRIPE_WEBHOOK_SECRET


@csrf_exempt
def stripe_webhook(request):
    payload = request.body
    sig_header = request.META.get("HTTP_STRIPE_SIGNATURE")

    try:
        event = stripe.Webhook.construct_event(
            payload=payload,
            sig_header=sig_header,
            secret=STRIPE_WEBHOOK_SECRET,
        )
    except Exception:
        return HttpResponse(status=400)

    # 🎯 ONLY event we care about
    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]

        metadata = session.get("metadata", {})
        payment_id = metadata.get("payment_id")
        payment_intent = session.get("payment_intent")

        if not payment_id:
            return HttpResponse(status=200)

        try:
            payment = Payment.objects.get(id=payment_id)

            if payment.status != Payment.STATUS_PAID:
                payment.status = Payment.STATUS_PAID
                payment.stripe_payment_intent = payment_intent
                payment.paid_at = timezone.now()
                payment.save(
                    update_fields=[
                        "status",
                        "stripe_payment_intent",
                        "paid_at",
                    ]
                )

        except Payment.DoesNotExist:
            pass

    return HttpResponse(status=200)
