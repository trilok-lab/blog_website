# payments/serializers.py
from rest_framework import serializers
from .models import Payment

class CreateCheckoutSessionSerializer(serializers.Serializer):
    amount = serializers.IntegerField(required=False, min_value=1)  # cents
    currency = serializers.CharField(required=False, default="usd")
    article_title = serializers.CharField(required=False, allow_blank=True)

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ["id", "user_id", "amount", "currency", "stripe_session_id", "status", "used", "created_at", "paid_at", "metadata"]
        read_only_fields = fields
