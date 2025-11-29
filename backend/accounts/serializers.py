# accounts/serializers.py
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import CustomUser, PhoneVerification
from django.contrib.auth import authenticate


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ["id", "username", "email", "mobile_no", "is_admin", "is_mobile_verified"]


class RegisterSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)
    email = serializers.EmailField(required=False, allow_blank=True)
    mobile_no = serializers.CharField()
    verification_session_id = serializers.UUIDField()

    def validate(self, attrs):
        if attrs["password"] != attrs["password2"]:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        # password validators
        validate_password(attrs["password"])
        # ensure session exists & is verified
        session_id = attrs.get("verification_session_id")
        try:
            pv = PhoneVerification.objects.get(session_id=session_id, mobile_no=attrs["mobile_no"])
        except PhoneVerification.DoesNotExist:
            raise serializers.ValidationError({"verification_session_id": "Invalid verification session."})
        if not pv.verified or pv.is_expired():
            raise serializers.ValidationError({"verification_session_id": "Phone not verified or session expired."})
        return attrs

    def create(self, validated_data):
        validated_data.pop("password2", None)
        session_id = validated_data.pop("verification_session_id", None)
        password = validated_data.pop("password")
        user = CustomUser.objects.create(
            username=validated_data["username"],
            email=validated_data.get("email", ""),
            mobile_no=validated_data["mobile_no"],
            is_active=True,
            is_mobile_verified=True,
        )
        user.set_password(password)
        user.save()
        # Optionally link the verification record -> mark verified_at already set
        return user


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(required=False, allow_blank=True)
    email = serializers.EmailField(required=False, allow_blank=True)
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        username = attrs.get("username") or attrs.get("email")
        password = attrs.get("password")
        if not username or not password:
            raise serializers.ValidationError("Provide username/email and password.")
        user = authenticate(username=username, password=password)
        if not user:
            # attempt authenticate by email if username failed
            from django.contrib.auth import get_user_model
            User = get_user_model()
            try:
                u = User.objects.get(email=username)
            except User.DoesNotExist:
                u = None
            if u:
                user = authenticate(username=u.username, password=password)
        if not user:
            raise serializers.ValidationError("Invalid credentials.")
        attrs["user"] = user
        return attrs
