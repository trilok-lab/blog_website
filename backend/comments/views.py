from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from .models import Comment
from .serializers import CommentSerializer
from accounts.permissions import IsAdminUserCustom
from articles.models import Article
from twilio.rest import Client
from django.conf import settings

# List & Create Comments
class CommentListCreateView(generics.ListCreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        article_id = self.request.query_params.get("article")
        if article_id:
            return Comment.objects.filter(article_id=article_id, is_approved=True)
        return Comment.objects.filter(is_approved=True)

    def perform_create(self, serializer):
        user = self.request.user if self.request.user.is_authenticated else None
        guest_name = self.request.data.get("guest_name")
        guest_mobile = self.request.data.get("guest_mobile")

        # For guest users, verify mobile via Twilio
        if not user:
            if not guest_name or not guest_mobile:
                raise serializers.ValidationError("Guest name and mobile required.")
            # Optionally, verify OTP here using Twilio API
            # client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
            # send verification code etc.

        serializer.save(user=user, guest_name=guest_name, guest_mobile=guest_mobile, is_approved=user.is_staff if user else False)

# Approve/Reject Comments (Admin)
class CommentApproveView(generics.UpdateAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated, IsAdminUserCustom]

    def update(self, request, *args, **kwargs):
        comment = self.get_object()
        action = request.data.get("action")
        if action not in ["approve", "reject"]:
            return Response({"error": "Invalid action"}, status=status.HTTP_400_BAD_REQUEST)
        comment.is_approved = True if action == "approve" else False
        comment.save()
        serializer = self.get_serializer(comment)
        return Response(serializer.data)
