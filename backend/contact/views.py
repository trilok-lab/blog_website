# contact/views.py
from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from django.core.mail import send_mail
from django.conf import settings
from django.core.cache import cache
from .models import ContactMessage
from .serializers import ContactMessageCreateSerializer, ContactMessageAdminSerializer

# Use your project admin permission if available
try:
    from accounts.permissions import IsAdminUserCustom
    AdminPermission = IsAdminUserCustom
except Exception:
    # fallback to DRF IsAuthenticated for admin endpoints if custom permission missing
    from rest_framework.permissions import IsAdminUser as AdminPermission  # type: ignore

# Simple rate limit settings
CONTACT_RATE_LIMIT_KEY = "contact_ip_count_{ip}"
CONTACT_RATE_LIMIT_MAX = 5
CONTACT_RATE_LIMIT_WINDOW = 60 * 60  # 1 hour


def _get_client_ip(request):
    # basic client IP extraction; adapt if behind proxies/load balancer (use X-Forwarded-For)
    xff = request.META.get("HTTP_X_FORWARDED_FOR")
    if xff:
        ip = xff.split(",")[0].strip()
    else:
        ip = request.META.get("REMOTE_ADDR", "")
    return ip


class ContactCreateView(generics.CreateAPIView):
    """
    POST /api/contact/submit/
    Body: { name, email, subject, message }
    """
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageCreateSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        # rate-limit per IP
        ip = _get_client_ip(request)
        key = CONTACT_RATE_LIMIT_KEY.format(ip=ip)
        count = cache.get(key, 0)
        if count >= CONTACT_RATE_LIMIT_MAX:
            return Response({"detail": "Rate limit exceeded. Try again later."},
                            status=status.HTTP_429_TOO_MANY_REQUESTS)

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        contact = serializer.save()
        # increment counter
        cache.set(key, count + 1, CONTACT_RATE_LIMIT_WINDOW)

        # send email to admin
        admin_email = getattr(settings, "CONTACT_EMAIL", None) or getattr(settings, "DEFAULT_FROM_EMAIL", None)
        from_email = getattr(settings, "DEFAULT_FROM_EMAIL", None)
        if admin_email and from_email:
            subject = f"[Contact] {contact.subject}"
            message = f"From: {contact.name} <{contact.email}>\n\n{contact.message}\n\n--\nReceived at: {contact.created_at}"
            try:
                send_mail(subject, message, from_email, [admin_email], fail_silently=True)
            except Exception as e:
                # do not leak email sending errors to client — log in real app
                pass

        return Response({"ok": True, "id": contact.id}, status=status.HTTP_201_CREATED)


class ContactListAdminView(generics.ListAPIView):
    """
    GET /api/contact/admin/list/
    Admin-only: list all contact messages (paginated)
    """
    queryset = ContactMessage.objects.all().order_by("-created_at")
    serializer_class = ContactMessageAdminSerializer
    permission_classes = [IsAuthenticated, AdminPermission]


class ContactReadUpdateView(generics.UpdateAPIView):
    """
    PATCH /api/contact/<id>/read/   body: { "is_read": true/false }
    Admin-only
    """
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageAdminSerializer
    permission_classes = [IsAuthenticated, AdminPermission]
    http_method_names = ["patch", "options", "head"]

    def patch(self, request, *args, **kwargs):
        contact = self.get_object()
        is_read = request.data.get("is_read")
        if is_read is None:
            return Response({"detail": "is_read field is required"}, status=status.HTTP_400_BAD_REQUEST)
        contact.is_read = bool(is_read)
        contact.save(update_fields=["is_read"])
        return Response(self.get_serializer(contact).data)
