# accounts/views.py
"""
Accounts API endpoints (replace existing V3).
API endpoints (paths):
- POST /auth/request-phone-code/    -> request OTP
- POST /auth/resend-phone-code/     -> resend OTP (rate limited)
- POST /auth/verify-phone-code/     -> verify OTP
- POST /auth/register/              -> register user (requires verification_session_id)
- POST /auth/login/                 -> login (username/email + password) -> returns access+refresh
- GET  /auth/profile/               -> current user profile
"""

import random
from datetime import timedelta
from django.utils import timezone
from django.conf import settings
from django.core.cache import cache
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .models import PhoneVerification, CustomUser
from .serializers import RegisterSerializer, LoginSerializer, UserSerializer
from rest_framework.decorators import api_view, permission_classes
from twilio.rest import Client as TwilioClient
from rest_framework_simplejwt.tokens import RefreshToken

OTP_REQUEST_LIMIT_KEY = "otp_req_count_{phone}"
OTP_REQUEST_LIMIT_WINDOW = 3600  # seconds (1 hour)
OTP_MAX_PER_WINDOW = 5

def _twilio_client():
    sid = settings.TWILIO_ACCOUNT_SID
    token = settings.TWILIO_AUTH_TOKEN
    return TwilioClient(sid, token)

def _generate_otp():
    return f"{random.randint(100000, 999999)}"

class RequestPhoneCodeView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        mobile_no = (request.data or {}).get("mobile_no", "").strip()
        if not mobile_no:
            return Response({"detail": "mobile_no required"}, status=status.HTTP_400_BAD_REQUEST)
        # rate-limiting using cache per phone
        key = OTP_REQUEST_LIMIT_KEY.format(phone=mobile_no)
        count = cache.get(key, 0)
        if count >= OTP_MAX_PER_WINDOW:
            return Response({"detail": "OTP request rate limit exceeded"}, status=status.HTTP_429_TOO_MANY_REQUESTS)
        otp = _generate_otp()
        pv = PhoneVerification.create_for_mobile(mobile_no, otp)
        # send via Twilio in production
        try:
            if settings.DEBUG:
                # return code in DEBUG for convenience
                return Response({"session_id": str(pv.session_id), "debug_otp": otp})
            client = _twilio_client()
            client.messages.create(body=f"Your verification code is {otp}", from_=settings.TWILIO_FROM_NUMBER, to=mobile_no)
            cache.set(key, count + 1, OTP_REQUEST_LIMIT_WINDOW)
            return Response({"session_id": str(pv.session_id)})
        except Exception as e:
            # optionally log
            return Response({"detail": "Failed to send SMS", "error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ResendPhoneCodeView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        mobile_no = (request.data or {}).get("mobile_no", "").strip()
        session_id = (request.data or {}).get("session_id")
        if not mobile_no or not session_id:
            return Response({"detail": "mobile_no and session_id required"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            pv = PhoneVerification.objects.get(session_id=session_id, mobile_no=mobile_no)
        except PhoneVerification.DoesNotExist:
            return Response({"detail": "Invalid session_id"}, status=status.HTTP_400_BAD_REQUEST)
        if pv.resend_count >= PhoneVerification.MAX_RESENDS:
            return Response({"detail": "Resend limit reached"}, status=status.HTTP_429_TOO_MANY_REQUESTS)
        # rate-limiting global per-phone enforced in RequestPhoneCodeView; still enforce resend_count
        otp = _generate_otp()
        pv.code = otp
        pv.increment_resend()
        try:
            if settings.DEBUG:
                return Response({"session_id": str(pv.session_id), "debug_otp": otp})
            client = _twilio_client()
            client.messages.create(body=f"Your verification code is {otp}", from_=settings.TWILIO_FROM_NUMBER, to=mobile_no)
            return Response({"session_id": str(pv.session_id)})
        except Exception as e:
            return Response({"detail": "Failed to resend SMS", "error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class VerifyPhoneCodeView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        data = request.data or {}
        session_id = data.get("session_id")
        code = data.get("code")
        if not session_id or not code:
            return Response({"detail": "session_id and code are required"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            pv = PhoneVerification.objects.get(session_id=session_id)
        except PhoneVerification.DoesNotExist:
            return Response({"detail": "Invalid session"}, status=status.HTTP_400_BAD_REQUEST)
        if pv.verified:
            return Response({"detail": "Already verified"}, status=status.HTTP_200_OK)
        if pv.is_expired():
            return Response({"detail": "Code expired"}, status=status.HTTP_400_BAD_REQUEST)
        pv.increment_attempts()
        if pv.attempts > PhoneVerification.MAX_ATTEMPTS:
            return Response({"detail": "Too many attempts"}, status=status.HTTP_429_TOO_MANY_REQUESTS)
        if pv.code != str(code).strip():
            return Response({"detail": "Invalid code"}, status=status.HTTP_400_BAD_REQUEST)
        pv.mark_verified()
        return Response({"verified": True, "mobile_no": pv.mobile_no})

class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        """
        Register new user.

        POST /auth/register/
        {
          "username": "bob",
          "password": "strongpass",
          "password2": "strongpass",
          "email": "bob@example.com",
          "mobile_no": "+911234567890",
          "verification_session_id": "<uuid>"
        }
        """
        ser = RegisterSerializer(data=request.data)
        if not ser.is_valid():
            return Response(ser.errors, status=status.HTTP_400_BAD_REQUEST)
        user = ser.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            "user": UserSerializer(user).data,
            "access": str(refresh.access_token),
            "refresh": str(refresh),
        })

class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        """
        POST /auth/login/
        {
          "username": "bob"   OR "email": "bob@example.com",
          "password": "..."
        }
        """
        ser = LoginSerializer(data=request.data)
        if not ser.is_valid():
            return Response(ser.errors, status=status.HTTP_400_BAD_REQUEST)
        user = ser.validated_data["user"]
        refresh = RefreshToken.for_user(user)
        return Response({
            "user": UserSerializer(user).data,
            "access": str(refresh.access_token),
            "refresh": str(refresh),
        })

@api_view(["GET"])
@permission_classes([permissions.IsAuthenticated])
def profile_view(request):
    """
    GET /auth/profile/
    """
    return Response(UserSerializer(request.user).data)
