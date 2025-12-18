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
      - Request a code: create PhoneVerification(mobile_no=.).session_id returned to client
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
    session_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True, db_index=True)
    attempts = models.IntegerField(default=0)
    resend_count = models.IntegerField(default=0)

    # configurable limits
    TTL = timedelta(minutes=10)
    MAX_ATTEMPTS = 5
    MAX_RESENDS = 3

    class Meta:
        ordering = ["-created_at"]

    @classmethod
    def create_for_mobile(cls, mobile_no, code, ttl_seconds=None):
        ttl = ttl_seconds or int(cls.TTL.total_seconds())
        now = timezone.now()
        expires_at = now + timezone.timedelta(seconds=ttl)
        pv = cls.objects.create(mobile_no=mobile_no, code=str(code).strip(), expires_at=expires_at)
        return pv

    def is_expired(self):
        return timezone.now() >= self.expires_at

    def mark_verified(self):
        self.verified = True
        self.save(update_fields=["verified"])

    def increment_attempts(self):
        self.attempts += 1
        self.save(update_fields=["attempts"])

    def increment_resend(self):
        self.resend_count += 1
        self.save(update_fields=["resend_count"])
