# notifications/emails.py
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
            to=[to_email]
        )
        if html_content:
            msg.attach_alternative(html_content, "text/html")
        msg.send(fail_silently=True)

    threading.Thread(target=_send).start()


def send_markdown_email(subject, template_name, context, to_email):
    """
    Renders a markdown template into HTML + plain text then sends email.
    """
    markdown_text = render_to_string(template_name, context)
    html_content = markdown2.markdown(markdown_text)
    text_content = markdown_text  # fallback plain-text

    send_async_email(subject, to_email, text_content, html_content)
