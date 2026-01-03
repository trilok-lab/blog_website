# accounts/whatsapp.py

import requests
import logging
from django.conf import settings

logger = logging.getLogger(__name__)


def send_whatsapp_otp(phone_number: str, otp: str) -> None:
    """
    Send OTP via WhatsApp Cloud API.

    - phone_number: international format (+91XXXXXXXXXX)
    - otp: 6 digit string

    Raises Exception if sending fails.
    """

    url = (
        f"https://graph.facebook.com/"
        f"{settings.WHATSAPP_API_VERSION}/"
        f"{settings.WHATSAPP_PHONE_NUMBER_ID}/messages"
    )

    payload = {
        "messaging_product": "whatsapp",
        # Meta expects digits only (no +)
        "to": phone_number.replace("+", ""),
        "type": "text",
        "text": {
            "body": (
                "🔐 Trilok Blog Verification\n\n"
                f"Your OTP is: *{otp}*\n\n"
                "This code expires in 10 minutes.\n"
                "Do not share this code with anyone."
            )
        },
    }

    headers = {
        "Authorization": f"Bearer {settings.WHATSAPP_ACCESS_TOKEN}",
        "Content-Type": "application/json",
    }

    response = requests.post(
        url,
        json=payload,
        headers=headers,
        timeout=15,
    )

    if response.status_code not in (200, 201):
        logger.error(
            "WhatsApp OTP failed | status=%s | response=%s",
            response.status_code,
            response.text,
        )
        raise Exception("WhatsApp OTP send failed")

    logger.info("WhatsApp OTP sent successfully to %s", phone_number)
