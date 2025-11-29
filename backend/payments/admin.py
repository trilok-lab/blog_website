# payments/admin.py
from django.contrib import admin
from .models import Payment

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "amount", "currency", "status", "used", "created_at", "paid_at")
    list_filter = ("status", "used", "currency")
    search_fields = ("stripe_session_id", "stripe_payment_intent", "user__username")
    readonly_fields = ("created_at", "paid_at")
