# accounts/views.py

from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .models import CustomUser
from .serializers import UserSerializer, UserRegisterSerializer
from django.conf import settings
import random

# In-memory store for OTPs (for development/testing)
OTP_STORE = {}


class RegisterView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    permission_classes = [AllowAny]
    serializer_class = UserRegisterSerializer

    def perform_create(self, serializer):
        user = serializer.save()
        self.send_otp(user.mobile_no)

    def send_otp(self, mobile_no):
        # Generate a random 6-digit OTP
        otp = str(random.randint(100000, 999999))

        # Store OTP temporarily (in-memory)
        OTP_STORE[mobile_no] = otp

        if settings.DEBUG:
            # Mock SMS sending in development
            print(f"[DEBUG] Mock OTP for {mobile_no}: {otp}")
            return otp
        else:
            # Real Twilio integration for production
            from twilio.rest import Client
            client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
            message = client.messages.create(
                body=f"Your verification code is {otp}",
                from_=settings.TWILIO_FROM_NUMBER,
                to=mobile_no
            )
            return message.sid


class VerifyMobileView(generics.GenericAPIView):
    permission_classes = [AllowAny]

    def post(self, request):
        mobile_no = request.data.get("mobile_no")
        otp = request.data.get("otp")

        try:
            user = CustomUser.objects.get(mobile_no=mobile_no)
            stored_otp = OTP_STORE.get(mobile_no)

            if stored_otp and otp == stored_otp:
                user.is_mobile_verified = True
                user.is_active = True
                user.save()
                # Remove OTP after successful verification
                OTP_STORE.pop(mobile_no, None)
                return Response({"detail": "Mobile verified"}, status=status.HTTP_200_OK)
            else:
                return Response({"error": "Invalid OTP"}, status=status.HTTP_400_BAD_REQUEST)

        except CustomUser.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
