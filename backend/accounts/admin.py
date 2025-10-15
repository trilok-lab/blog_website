from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser


@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        (
            "Additional Info",
            {
                "fields": (
                    "mobile_no",
                    "is_admin",
                )
            },
        ),
    )
    list_display = ("username", "email", "mobile_no", "is_staff", "is_admin")

# Register your models here.
