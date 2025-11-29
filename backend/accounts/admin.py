# accounts/admin.py
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, PhoneVerification

@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        ("Additional Info", {"fields": ("mobile_no", "is_admin", "is_mobile_verified")}),
    )
    list_display = ("username", "email", "mobile_no", "is_staff", "is_admin", "is_mobile_verified")

@admin.register(PhoneVerification)
class PhoneVerificationAdmin(admin.ModelAdmin):
    list_display = ("mobile_no", "session_id", "verified", "created_at", "expires_at", "attempts", "resend_count")
    readonly_fields = ("session_id",)
