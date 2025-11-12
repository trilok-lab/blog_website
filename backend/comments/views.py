from rest_framework import viewsets, decorators, response, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import Comment
from .serializers import CommentSerializer
from accounts.models import PhoneVerification
from django.utils import timezone


class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.select_related("article", "user").all()
    serializer_class = CommentSerializer

    def get_permissions(self):
        if self.action in ["list", "retrieve", "create"]:
            return [AllowAny()]
        return [IsAuthenticated()]

    def perform_create(self, serializer):
        user = self.request.user if self.request.user.is_authenticated else None
        is_guest = user is None
        if is_guest:
            session_id = self.request.data.get("verification_session_id")
            if not session_id:
                raise Exception("Phone verification required for guest comments")
            try:
                pv = PhoneVerification.objects.get(session_id=session_id)
            except PhoneVerification.DoesNotExist:
                raise Exception("Invalid verification session")
            if not pv.verified or pv.expires_at < timezone.now():
                raise Exception("Phone not verified or expired")
        serializer.save(user=user, approved=(not is_guest and getattr(user, "is_admin", False)))

    @decorators.action(detail=False, methods=["post"], url_path="guest/request-code")
    def guest_request_code(self, request):
        # Twilio integration placeholder
        return response.Response({"detail": "Verification code sent."})

    @decorators.action(detail=False, methods=["post"], url_path="guest/verify-code")
    def guest_verify_code(self, request):
        # Twilio verification placeholder
        return response.Response({"detail": "Phone verified."})

