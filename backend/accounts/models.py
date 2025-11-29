# accounts/models.py
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone
from django.core.validators import RegexValidator
import uuid
from datetime import timedelta

class CustomUser(AbstractUser):
    mobile_no = models.CharField(max_length=20, blank=True, null=True, unique=True)
    is_admin = models.BooleanField(default=False)
    is_mobile_verified = models.BooleanField(default=False)

    def __str__(self) -> str:
        return self.username


class PhoneVerification(models.Model):
    """
    Stores OTP sessions for a mobile number.
    Usage:
      - Request a code: create PhoneVerification(mobile_no=..).session_id returned to client
      - Verify: client posts session_id + code
    """
    mobile_no = models.CharField(
        max_length=20,
        validators=[RegexValidator(r"^[0-9+\-()\s]+$", "Invalid phone number format")],
        db_index=True,
    )
    code = models.CharField(max_length=6)
    created_at = models.DateTimeField(default=timezone.now)
    expires_at = models.DateTimeField()
    verified = models.BooleanField(default=False)
    verified_at = models.DateTimeField(blank=True, null=True)
    session_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    attempts = models.PositiveSmallIntegerField(default=0)      # verification attempts
    resend_count = models.PositiveSmallIntegerField(default=0)  # number of times code resent

    OTP_TTL = timedelta(minutes=10)
    MAX_ATTEMPTS = 5
    MAX_RESENDS = 3

    def mark_verified(self):
        self.verified = True
        self.verified_at = timezone.now()
        self.save(update_fields=["verified", "verified_at"])

    def is_expired(self):
        return timezone.now() > self.expires_at

    @classmethod
    def create_for_mobile(cls, mobile_no, code, now=None):
        now = now or timezone.now()
        expires = now + cls.OTP_TTL
        return cls.objects.create(mobile_no=mobile_no, code=code, expires_at=expires)

    def increment_attempts(self):
        self.attempts = (self.attempts or 0) + 1
        self.save(update_fields=["attempts"])

    def increment_resend(self):
        self.resend_count = (self.resend_count or 0) + 1
        self.expires_at = timezone.now() + self.OTP_TTL  # extend TTL on resend
        self.save(update_fields=["resend_count", "expires_at"])
