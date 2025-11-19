from rest_framework import generics
from .models import ContactMessage
from .serializers import ContactMessageSerializer
from django.core.mail import send_mail
from django.conf import settings

class ContactCreateView(generics.CreateAPIView):
    serializer_class = ContactMessageSerializer

    def perform_create(self, serializer):
        msg = serializer.save()
        send_mail(
            subject=f"New Contact Message from {msg.name}",
            message=msg.message,
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[settings.EMAIL_HOST_USER],
            fail_silently=True
        )
