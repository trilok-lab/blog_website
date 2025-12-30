from rest_framework import viewsets, filters, serializers, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db import transaction
from django.db.models import F
from django.utils import timezone
from django.conf import settings

from .models import Article, Category
from .serializers import ArticleSerializer, CategorySerializer
from .permissions import IsOwnerOrAdminCanEdit

from accounts.models import PhoneVerification
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
        """
        - Anyone can READ categories (list, retrieve)
        - Only authenticated users (admin) can create/update/delete
        """
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
        # Public-facing endpoints
        if self.action in ["list", "retrieve", "create", "slider", "popular"]:
            return [AllowAny()]
        # Edit/delete restricted
        return [IsAuthenticated(), IsOwnerOrAdminCanEdit()]

    def get_queryset(self):
        qs = super().get_queryset()

        # Public only sees approved articles
        if self.action in ["list", "retrieve", "slider", "popular"]:
            user = getattr(self.request, "user", None)
            if user and user.is_authenticated and getattr(user, "is_admin", False):
                return qs
            return qs.filter(is_approved=True)

        return qs

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()

        # Increment popularity safely
        Article.objects.filter(pk=instance.pk).update(
            popularity=F("popularity") + 1
        )
        instance.refresh_from_db(fields=["popularity"])

        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def perform_create(self, serializer):
        """
        - Authenticated user: article auto-attached to user
        - Admin: auto-approved
        - Guest: verification + payment required
        """
        request = self.request
        user = request.user if request.user.is_authenticated else None

        if user:
            serializer.save(
                author=user,
                is_approved=getattr(user, "is_admin", False),
            )
            return

        # ---------- Guest submission ----------
        data = request.data or {}
        session_id = data.get("verification_session_id")
        payment_id = data.get("payment_id")

        if not session_id:
            raise serializers.ValidationError({
                "verification_session_id": "Phone verification required."
            })

        if not payment_id:
            raise serializers.ValidationError({
                "payment_id": "Payment is required."
            })

        # Phone verification
        try:
            pv = PhoneVerification.objects.get(session_id=session_id)
        except PhoneVerification.DoesNotExist:
            raise serializers.ValidationError({
                "verification_session_id": "Invalid verification session."
            })

        if pv.verified is not True:
            raise serializers.ValidationError({
                "verification_session_id": "Phone not verified."
            })

        if hasattr(pv, "is_expired") and pv.is_expired():
            raise serializers.ValidationError({
                "verification_session_id": "Verification expired."
            })

        # Payment validation
        try:
            with transaction.atomic():
                p = Payment.objects.select_for_update().get(id=payment_id)

                if p.used:
                    raise serializers.ValidationError({
                        "payment_id": "Payment already used."
                    })

                if p.status != Payment.STATUS_PAID:
                    raise serializers.ValidationError({
                        "payment_id": "Payment not completed."
                    })

                p.used = True
                p.save(update_fields=["used"])

        except Payment.DoesNotExist:
            raise serializers.ValidationError({
                "payment_id": "Payment not found."
            })

        serializer.save(author=None, is_approved=False)

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
