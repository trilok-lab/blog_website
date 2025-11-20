from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    mobile_no = models.CharField(max_length=15, unique=True, null=True, blank=True)
    is_admin = models.BooleanField(default=False)
    is_mobile_verified = models.BooleanField(default=False)

    def __str__(self):
        return self.username
