from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .models import CustomUser
from .serializers import UserSerializer, UserRegisterSerializer
from django.conf import settings
from twilio.rest import Client

class RegisterView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    permission_classes = [AllowAny]
    serializer_class = UserRegisterSerializer

    def perform_create(self, serializer):
        user = serializer.save()
        self.send_otp(user.mobile_no)

    def send_otp(self, mobile_no):
        client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
        verification = client.messages.create(
            body=f"Your verification code is 123456",  # Replace with real OTP generation
            from_=settings.TWILIO_FROM_NUMBER,
            to=mobile_no
        )
        return verification.sid

class VerifyMobileView(generics.GenericAPIView):
    permission_classes = [AllowAny]

    def post(self, request):
        mobile_no = request.data.get("mobile_no")
        otp = request.data.get("otp")
        # In real implementation, verify OTP via Twilio Verify API
        try:
            user = CustomUser.objects.get(mobile_no=mobile_no)
            if otp == "123456":
                user.is_mobile_verified = True
                user.is_active = True
                user.save()
                return Response({"detail": "Mobile verified"}, status=status.HTTP_200_OK)
            else:
                return Response({"error": "Invalid OTP"}, status=status.HTTP_400_BAD_REQUEST)
        except CustomUser.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
