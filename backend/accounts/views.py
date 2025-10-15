import random
from datetime import timedelta
from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
from twilio.rest import Client
from .models import PhoneVerification, CustomUser
from django.contrib.auth.hashers import make_password
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import api_view
from django.http import HttpResponseRedirect


def _twilio_client():
    sid = settings.TWILIO_ACCOUNT_SID
    token = settings.TWILIO_AUTH_TOKEN
    return Client(sid, token)


class RequestPhoneCodeView(APIView):
    def post(self, request, *args, **kwargs):
        mobile_no = (request.data or {}).get("mobile_no", "").strip()
        if not mobile_no:
            return Response({"detail": "mobile_no is required"}, status=status.HTTP_400_BAD_REQUEST)
        code = f"{random.randint(100000, 999999)}"
        expires = timezone.now() + timedelta(minutes=10)
        pv = PhoneVerification.objects.create(mobile_no=mobile_no, code=code, expires_at=expires)
        try:
            client = _twilio_client()
            client.messages.create(
                body=f"Your verification code is {code}",
                from_=settings.TWILIO_FROM_NUMBER,
                to=mobile_no,
            )
        except Exception:
            # In dev, allow returning the code for convenience
            # In production, you might want to log this error and return a generic success message
            # to prevent enumeration attacks, or a specific error if Twilio is critical.
            pass
        return Response({"session_id": str(pv.session_id)})


class VerifyPhoneCodeView(APIView):
    def post(self, request, *args, **kwargs):
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
            return Response({"detail": "Already verified"})
        if pv.expires_at < timezone.now() or pv.code != code:
            return Response({"detail": "Invalid or expired code"}, status=status.HTTP_400_BAD_REQUEST)
        pv.mark_verified()
        return Response({"verified": True, "mobile_no": pv.mobile_no})


class RegisterView(APIView):
    def post(self, request, *args, **kwargs):
        data = request.data or {}
        username = (data.get("username") or "").strip()
        email = (data.get("email") or "").strip()
        password = data.get("password") or ""
        mobile_no = (data.get("mobile_no") or "").strip()
        session_id = data.get("verification_session_id")
        if not (username and password and mobile_no and session_id):
            return Response({"detail": "username, password, mobile_no, and verification_session_id are required"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            pv = PhoneVerification.objects.get(session_id=session_id, mobile_no=mobile_no)
        except PhoneVerification.DoesNotExist:
            return Response({"detail": "Invalid verification session"}, status=status.HTTP_400_BAD_REQUEST)
        if not pv.verified:
            return Response({"detail": "Phone not verified"}, status=status.HTTP_400_BAD_REQUEST)
        if CustomUser.objects.filter(username=username).exists():
            return Response({"detail": "Username already taken"}, status=status.HTTP_400_BAD_REQUEST)
        if email and CustomUser.objects.filter(email=email).exists():
            return Response({"detail": "Email already in use"}, status=status.HTTP_400_BAD_REQUEST)
        
        user = CustomUser.objects.create(
            username=username,
            email=email,
            mobile_no=mobile_no,
            password=make_password(password),
        )
        
        refresh = RefreshToken.for_user(user)
        
        return Response({
            "user": {"id": user.id, "username": user.username, "email": user.email, "mobile_no": user.mobile_no},
            "access": str(refresh.access_token),
            "refresh": str(refresh),
        })


@api_view(["GET"])
def mobile_complete(request):
    user = request.user if request.user.is_authenticated else None
    if not user:
        return HttpResponseRedirect('/')
    refresh = RefreshToken.for_user(user)
    # Redirect to app scheme or web with tokens as query params
    target = request.GET.get('redirect', 'frontend://auth')
    sep = '&' if '?' in target else '?'
    url = f"{target}{sep}access={str(refresh.access_token)}&refresh={str(refresh)}"
    return HttpResponseRedirect(url)

# Create your views here.
