from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
from django.core.validators import RegexValidator
import uuid

class CustomUser(AbstractUser):
    """
    Custom user model with mobile_no and is_admin flag
    """
    mobile_no = models.CharField(max_length=20, blank=True, null=True, unique=True)
    is_admin = models.BooleanField(default=False)

    def __str__(self):
        return self.username

class PhoneVerification(models.Model):
    """
    Stores verification codes for mobile numbers
    """
    mobile_no = models.CharField(
        max_length=20,
        validators=[RegexValidator(r"^[0-9+\-()\s]+$", "Invalid phone number format")],
        db_index=True
    )
    code = models.CharField(max_length=6)
    created_at = models.DateTimeField(default=timezone.now)
    expires_at = models.DateTimeField()
    verified = models.BooleanField(default=False)
    verified_at = models.DateTimeField(blank=True, null=True)
    session_id = models.UUIDField(default=uuid.uuid4, editable=False)

    def mark_verified(self):
        self.verified = True
        self.verified_at = timezone.now()
        self.save(update_fields=["verified", "verified_at"])
