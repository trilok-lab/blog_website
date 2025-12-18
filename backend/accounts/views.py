# accounts/views.py

import random
import requests

from django.conf import settings
from django.core.cache import cache
from django.utils import timezone

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.tokens import RefreshToken

from twilio.rest import Client as TwilioClient

from .models import PhoneVerification, CustomUser
from .serializers import RegisterSerializer, LoginSerializer, UserSerializer


# =====================================================
# OTP / TWILIO CONFIG
# =====================================================

OTP_REQUEST_LIMIT_KEY = "otp_req_count_{phone}"
OTP_REQUEST_LIMIT_WINDOW = 3600  # 1 hour
OTP_MAX_PER_WINDOW = 5


def _twilio_client():
    return TwilioClient(
        settings.TWILIO_ACCOUNT_SID,
        settings.TWILIO_AUTH_TOKEN
    )


def _generate_otp():
    return f"{random.randint(100000, 999999)}"


# =====================================================
# PHONE VERIFICATION
# =====================================================

class RequestPhoneCodeView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        mobile_no = request.data.get("mobile_no", "").strip()
        if not mobile_no:
            return Response({"detail": "mobile_no required"}, status=400)

        key = OTP_REQUEST_LIMIT_KEY.format(phone=mobile_no)
        count = cache.get(key, 0)
        if count >= OTP_MAX_PER_WINDOW:
            return Response({"detail": "OTP request limit exceeded"}, status=429)

        otp = _generate_otp()
        pv = PhoneVerification.create_for_mobile(mobile_no, otp)

        if settings.DEBUG:
            return Response({
                "session_id": str(pv.session_id),
                "debug_otp": otp
            })

        try:
            client = _twilio_client()
            client.messages.create(
                body=f"Your verification code is {otp}",
                from_=settings.TWILIO_FROM_NUMBER,
                to=mobile_no
            )
            cache.set(key, count + 1, OTP_REQUEST_LIMIT_WINDOW)
            return Response({"session_id": str(pv.session_id)})
        except Exception as e:
            return Response({"detail": str(e)}, status=500)


class ResendPhoneCodeView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        mobile_no = request.data.get("mobile_no")
        session_id = request.data.get("session_id")

        if not mobile_no or not session_id:
            return Response({"detail": "mobile_no and session_id required"}, status=400)

        try:
            pv = PhoneVerification.objects.get(
                session_id=session_id,
                mobile_no=mobile_no
            )
        except PhoneVerification.DoesNotExist:
            return Response({"detail": "Invalid session"}, status=400)

        if pv.resend_count >= PhoneVerification.MAX_RESENDS:
            return Response({"detail": "Resend limit reached"}, status=429)

        otp = _generate_otp()
        pv.code = otp
        pv.increment_resend()

        if settings.DEBUG:
            return Response({
                "session_id": str(pv.session_id),
                "debug_otp": otp
            })

        try:
            client = _twilio_client()
            client.messages.create(
                body=f"Your verification code is {otp}",
                from_=settings.TWILIO_FROM_NUMBER,
                to=mobile_no
            )
            return Response({"session_id": str(pv.session_id)})
        except Exception as e:
            return Response({"detail": str(e)}, status=500)


class VerifyPhoneCodeView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        session_id = request.data.get("session_id")
        code = request.data.get("code")

        if not session_id or not code:
            return Response({"detail": "session_id and code required"}, status=400)

        try:
            pv = PhoneVerification.objects.get(session_id=session_id)
        except PhoneVerification.DoesNotExist:
            return Response({"detail": "Invalid session"}, status=400)

        if pv.verified:
            return Response({"verified": True})

        if pv.is_expired():
            return Response({"detail": "Code expired"}, status=400)

        pv.increment_attempts()
        if pv.attempts > PhoneVerification.MAX_ATTEMPTS:
            return Response({"detail": "Too many attempts"}, status=429)

        if pv.code != str(code):
            return Response({"detail": "Invalid code"}, status=400)

        pv.mark_verified()
        return Response({"verified": True, "mobile_no": pv.mobile_no})


# =====================================================
# NORMAL AUTH
# =====================================================

class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(
            {"user": UserSerializer(user).data},
            status=201
        )


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]

        refresh = RefreshToken.for_user(user)
        return Response({
            "user": UserSerializer(user).data,
            "access": str(refresh.access_token),
            "refresh": str(refresh),
        })


# =====================================================
# SOCIAL LOGIN (GOOGLE + FACEBOOK) — TOKEN BASED
# =====================================================

class SocialLoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        provider = request.data.get("provider")
        token = request.data.get("token")

        if not provider or not token:
            return Response({"detail": "provider and token required"}, status=400)

        provider = provider.lower()

        if provider == "google":
            data = self._verify_google(token)
        elif provider == "facebook":
            data = self._verify_facebook(token)
        else:
            return Response({"detail": "Unsupported provider"}, status=400)

        if not data or not data.get("email"):
            return Response({"detail": "Invalid social token"}, status=400)

        user, _ = CustomUser.objects.get_or_create(
            email=data["email"],
            defaults={
                "username": data["email"].split("@")[0],
                "is_active": True,
            }
        )

        refresh = RefreshToken.for_user(user)
        return Response({
            "user": UserSerializer(user).data,
            "access": str(refresh.access_token),
            "refresh": str(refresh),
        })

    def _verify_google(self, token):
        r = requests.get(
            "https://www.googleapis.com/oauth2/v3/tokeninfo",
            params={"id_token": token}
        )
        if r.status_code != 200:
            return None

        data = r.json()
        if data.get("aud") != settings.GOOGLE_WEB_CLIENT_ID:
            return None

        return {
            "email": data.get("email"),
            "name": data.get("name"),
        }

    def _verify_facebook(self, token):
        r = requests.get(
            "https://graph.facebook.com/me",
            params={
                "fields": "id,name,email",
                "access_token": token
            }
        )
        if r.status_code != 200:
            return None

        data = r.json()
        if "error" in data:
            return None

        return {
            "email": data.get("email"),
            "name": data.get("name"),
        }


# =====================================================
# PROFILE
# =====================================================

@api_view(["GET"])
@permission_classes([permissions.IsAuthenticated])
def profile_view(request):
    return Response(UserSerializer(request.user).data)
