# contact/serializers.py
from rest_framework import serializers
from .models import ContactMessage

class ContactMessageCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ["id", "name", "email", "subject", "message"]

    def validate_name(self, v):
        v = v.strip()
        if not v:
            raise serializers.ValidationError("Name is required.")
        if len(v) < 2:
            raise serializers.ValidationError("Name is too short.")
        return v

    def validate_subject(self, v):
        v = v.strip()
        if not v:
            raise serializers.ValidationError("Subject is required.")
        return v

    def validate_message(self, v):
        v = v.strip()
        if not v:
            raise serializers.ValidationError("Message is required.")
        if len(v) < 10:
            raise serializers.ValidationError("Message is too short.")
        return v


class ContactMessageAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ["id", "name", "email", "subject", "message", "is_read", "created_at"]
        read_only_fields = ["id", "created_at"]
