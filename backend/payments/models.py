# payments/models.py
from django.db import models
from django.conf import settings

class Payment(models.Model):
    STATUS_PENDING = "pending"
    STATUS_PAID = "paid"
    STATUS_FAILED = "failed"

    STATUS_CHOICES = [
        (STATUS_PENDING, "Pending"),
        (STATUS_PAID, "Paid"),
        (STATUS_FAILED, "Failed"),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name="payments"
    )
    amount = models.PositiveIntegerField(help_text="Amount in cents")
    currency = models.CharField(max_length=10, default="usd")
    stripe_session_id = models.CharField(max_length=200, blank=True, null=True, unique=True)
    stripe_payment_intent = models.CharField(max_length=200, blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_PENDING)
    used = models.BooleanField(default=False, help_text="Marked true when consumed for an article")
    created_at = models.DateTimeField(auto_now_add=True)
    paid_at = models.DateTimeField(null=True, blank=True)
    metadata = models.JSONField(default=dict, blank=True)

    class Meta:
        ordering = ["-created_at"]

    def mark_paid(self, intent_id=None, paid_at=None):
        self.status = self.STATUS_PAID
        if intent_id:
            self.stripe_payment_intent = intent_id
        if paid_at:
            self.paid_at = paid_at
        self.save(update_fields=["status", "stripe_payment_intent", "paid_at"])

    def mark_failed(self):
        self.status = self.STATUS_FAILED
        self.save(update_fields=["status"])
