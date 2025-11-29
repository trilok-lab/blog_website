# payments/webhook.py
import stripe
import json
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from django.http import HttpResponse, JsonResponse
from django.utils import timezone

from .models import Payment

stripe.api_key = getattr(settings, "STRIPE_SECRET_KEY", None)
STRIPE_WEBHOOK_SECRET = getattr(settings, "STRIPE_WEBHOOK_SECRET", None)


@csrf_exempt
def stripe_webhook(request):
    payload = request.body
    sig_header = request.META.get("HTTP_STRIPE_SIGNATURE", "")
    event = None

    try:
        if STRIPE_WEBHOOK_SECRET:
            event = stripe.Webhook.construct_event(payload, sig_header, STRIPE_WEBHOOK_SECRET)
        else:
            # If webhook secret not set, parse payload unsafely (use only for development)
            event = json.loads(payload)
    except ValueError:
        return HttpResponse(status=400)
    except stripe.error.SignatureVerificationError:
        return HttpResponse(status=400)

    # Handle checkout.session.completed (preferred for Checkout)
    if event and event.get("type") == "checkout.session.completed":
        session = event["data"]["object"]
        metadata = session.get("metadata", {}) or {}
        payment_id = metadata.get("payment_id")
        payment_intent = session.get("payment_intent")
        # Mark Payment as paid
        if payment_id:
            try:
                p = Payment.objects.get(id=payment_id)
                p.mark_paid(intent_id=payment_intent, paid_at=timezone.now())
            except Payment.DoesNotExist:
                # Log missing payment (admin should inspect)
                pass

    # Also handle payment_intent.succeeded as fallback
    if event and event.get("type") == "payment_intent.succeeded":
        intent = event["data"]["object"]
        # try to find payment by intent id
        pi = intent.get("id")
        try:
            p = Payment.objects.get(stripe_payment_intent=pi)
            p.mark_paid(intent_id=pi, paid_at=timezone.now())
        except Payment.DoesNotExist:
            # no match; ignore
            pass

    return HttpResponse(status=200)
