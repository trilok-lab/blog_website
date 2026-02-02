# backend/articles/views.py

from rest_framework import viewsets, filters, serializers
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db import transaction
from django.db.models import F

from .models import Article, Category
from .serializers import ArticleSerializer, CategorySerializer
from .permissions import IsOwnerOrAdminCanEdit

from accounts.models import PhoneVerification, CustomUser
from payments.models import Payment


# =========================
# CATEGORY VIEWSET
# =========================
class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ["name", "slug"]

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            return [AllowAny()]
        return [IsAuthenticated()]


# =========================
# ARTICLE VIEWSET
# =========================
class ArticleViewSet(viewsets.ModelViewSet):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]
    filterset_fields = ["is_approved", "is_slider", "categories__slug"]
    search_fields = ["title", "excerpt", "body", "slug"]
    ordering_fields = ["created_at", "popularity"]

    def get_permissions(self):
        """
        - create is AllowAny (guest + users)
        - actual enforcement happens in perform_create
        """
        if self.action in ["list", "retrieve", "create", "slider", "popular"]:
            return [AllowAny()]
        return [IsAuthenticated(), IsOwnerOrAdminCanEdit()]

    def get_queryset(self):
        qs = super().get_queryset()

        if self.action in ["list", "retrieve", "slider", "popular"]:
            user = getattr(self.request, "user", None)
            if user and user.is_authenticated and getattr(user, "is_admin", False):
                return qs
            return qs.filter(is_approved=True)

        return qs

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        Article.objects.filter(pk=instance.pk).update(
            popularity=F("popularity") + 1
        )
        instance.refresh_from_db(fields=["popularity"])
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    # =========================
    # ARTICLE CREATE (CORE LOGIC)
    # =========================
    def perform_create(self, serializer):
        request = self.request
        data = request.data or {}
        user = request.user if request.user.is_authenticated else None
        payment_id = data.get("payment_id")

        # ======================================================
        # LOGGED-IN USER FLOW
        # ======================================================
        if user:
            if not payment_id:
                raise serializers.ValidationError({
                    "payment_id": "Payment is required before submitting an article."
                })

            try:
                with transaction.atomic():
                    payment = Payment.objects.select_for_update().get(
                        id=payment_id,
                        user=user
                    )

                    if payment.used:
                        raise serializers.ValidationError({
                            "payment_id": "Payment already used."
                        })

                    if payment.status != Payment.STATUS_PAID:
                        raise serializers.ValidationError({
                            "payment_id": "Payment not completed."
                        })

                    payment.used = True
                    payment.save(update_fields=["used"])

            except Payment.DoesNotExist:
                raise serializers.ValidationError({
                    "payment_id": "Payment not found."
                })

            serializer.save(
                author=user,
                is_approved=getattr(user, "is_admin", False),
            )
            return

        # ======================================================
        # GUEST USER FLOW (OTP + PAYMENT)
        # ======================================================
        verification_session_id = data.get("verification_session_id")

        if not verification_session_id:
            raise serializers.ValidationError({
                "verification_session_id": "Phone verification required."
            })

        if not payment_id:
            raise serializers.ValidationError({
                "payment_id": "Payment is required."
            })

        try:
            pv = PhoneVerification.objects.get(
                session_id=verification_session_id
            )
        except PhoneVerification.DoesNotExist:
            raise serializers.ValidationError({
                "verification_session_id": "Invalid verification session."
            })

        if pv.verified is not True:
            raise serializers.ValidationError({
                "verification_session_id": "Phone not verified."
            })

        if pv.is_expired():
            raise serializers.ValidationError({
                "verification_session_id": "Verification expired."
            })

        try:
            with transaction.atomic():
                payment = Payment.objects.select_for_update().get(
                    id=payment_id
                )

                if payment.used:
                    raise serializers.ValidationError({
                        "payment_id": "Payment already used."
                    })

                if payment.status != Payment.STATUS_PAID:
                    raise serializers.ValidationError({
                        "payment_id": "Payment not completed."
                    })

                payment.used = True
                payment.save(update_fields=["used"])

        except Payment.DoesNotExist:
            raise serializers.ValidationError({
                "payment_id": "Payment not found."
            })

        # 🔑 ASSIGN SYSTEM GUEST USER
        try:
            guest_user = CustomUser.objects.get(username="GUEST")
        except CustomUser.DoesNotExist:
            raise serializers.ValidationError({
                "author": "System user GUEST not found. Create it in admin."
            })

        serializer.save(
            author=guest_user,
            is_approved=False,
        )

    # =========================
    # EXTRA ENDPOINTS
    # =========================
    @action(detail=False, methods=["get"], url_path="slider")
    def slider(self, request):
        qs = self.get_queryset().filter(is_slider=True).order_by("-created_at")
        page = self.paginate_queryset(qs)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["get"], url_path="popular")
    def popular(self, request):
        qs = self.get_queryset().order_by("-popularity")[:20]
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)
