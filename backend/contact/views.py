from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.core.mail import send_mail
from django.conf import settings
from .models import ContactMessage
from .serializers import ContactMessageSerializer
from accounts.permissions import IsAdminUserCustom

# Create contact message (AJAX/API)
class ContactCreateView(generics.CreateAPIView):
    serializer_class = ContactMessageSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        contact_msg = serializer.save()
        # Send email notification to admin
        try:
            send_mail(
                subject=f"New Contact Message: {contact_msg.subject}",
                message=f"From: {contact_msg.name} <{contact_msg.email}>\n\n{contact_msg.message}",
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[settings.DEFAULT_FROM_EMAIL],
                fail_silently=True
            )
        except Exception as e:
            print(f"Failed to send email: {e}")

# List all messages (Admin)
class ContactListView(generics.ListAPIView):
    serializer_class = ContactMessageSerializer
    queryset = ContactMessage.objects.all().order_by("-created_at")
    permission_classes = [IsAuthenticated, IsAdminUserCustom]

# Mark message as read/unread (Admin)
class ContactUpdateView(generics.UpdateAPIView):
    serializer_class = ContactMessageSerializer
    queryset = ContactMessage.objects.all()
    permission_classes = [IsAuthenticated, IsAdminUserCustom]

    def update(self, request, *args, **kwargs):
        msg = self.get_object()
        is_read = request.data.get("is_read")
        if is_read is None:
            return Response({"error": "is_read field is required"}, status=status.HTTP_400_BAD_REQUEST)
        msg.is_read = bool(is_read)
        msg.save()
        return Response(self.get_serializer(msg).data)
