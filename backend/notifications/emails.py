# backend/notifications/emails.py
import threading
from django.core.mail import EmailMultiAlternatives
from django.conf import settings
from django.template.loader import render_to_string
import markdown2


def send_async_email(subject, to_email, text_content, html_content):
    """Send email in a separate thread (non-blocking)."""

    def _send():
        msg = EmailMultiAlternatives(
            subject=subject,
            body=text_content,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[to_email],
        )
        if html_content:
            msg.attach_alternative(html_content, "text/html")
        msg.send(fail_silently=True)

    threading.Thread(target=_send, daemon=True).start()


def send_markdown_email(subject, template_name, context, to_email):
    """
    Render a Markdown email template into:
    - Plain text (fallback)
    - HTML (via markdown)
    """

    markdown_text = render_to_string(template_name, context)

    html_content = markdown2.markdown(
        markdown_text,
        extras=["fenced-code-blocks", "tables"]
    )

    text_content = markdown_text

    send_async_email(
        subject=subject,
        to_email=to_email,
        text_content=text_content,
        html_content=html_content,
    )
