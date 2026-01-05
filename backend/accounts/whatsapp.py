# backend/accounts/whatsapp.py

import requests
import logging
from django.conf import settings

logger = logging.getLogger(__name__)


def send_whatsapp_otp(phone_number: str, otp: str) -> None:
    """
    Send OTP via WhatsApp Cloud API (plain text message)
    phone_number: +91XXXXXXXXXX or 91XXXXXXXXXX
    """

    url = (
        f"https://graph.facebook.com/"
        f"{settings.WHATSAPP_API_VERSION}/"
        f"{settings.WHATSAPP_PHONE_NUMBER_ID}/messages"
    )

    clean_phone = phone_number.replace("+", "").strip()

    payload = {
        "messaging_product": "whatsapp",
        "recipient_type": "individual",
        "to": clean_phone,
        "type": "text",
        "text": {
            "preview_url": False,
            "body": f"Your OTP is {otp}"
        },
    }

    headers = {
        "Authorization": f"Bearer {settings.WHATSAPP_ACCESS_TOKEN}",
        "Content-Type": "application/json",
    }

    logger.warning("📤 WhatsApp OTP REQUEST")
    logger.warning("URL: %s", url)
    logger.warning("PAYLOAD: %s", payload)

    response = requests.post(
        url,
        json=payload,
        headers=headers,
        timeout=15,
    )

    logger.warning(
        "📥 WhatsApp OTP RESPONSE | status=%s | body=%s",
        response.status_code,
        response.text,
    )

    if response.status_code not in (200, 201):
        raise Exception(
            f"WhatsApp OTP failed | {response.status_code} | {response.text}"
        )
