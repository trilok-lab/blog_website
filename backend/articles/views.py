from rest_framework import viewsets, filters
from rest_framework.permissions import AllowAny, IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from .models import Article, Category
from .serializers import ArticleSerializer, CategorySerializer
from .permissions import IsOwnerOrAdminCanEdit
from accounts.models import PhoneVerification
from django.utils import timezone
from rest_framework.exceptions import ValidationError
from django.conf import settings
import stripe


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]
    filter_backends = [filters.SearchFilter]
    search_fields = ["name", "slug"]


class ArticleViewSet(viewsets.ModelViewSet):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["approved", "is_slider", "categories__slug"]
    search_fields = ["title", "excerpt", "body", "slug"]
    ordering_fields = ["created_at", "popularity"]

    def get_permissions(self):
        if self.action in ["list", "retrieve", "create"]:
            return [AllowAny()]
        return [IsAuthenticated(), IsOwnerOrAdminCanEdit()]

    def perform_create(self, serializer):
        user = self.request.user if self.request.user.is_authenticated else None
        if user is None:
            session_id = self.request.data.get("verification_session_id")
            if not session_id:
                raise ValidationError({"detail": "Phone verification required for guest submissions"})
            try:
                pv = PhoneVerification.objects.get(session_id=session_id)
            except PhoneVerification.DoesNotExist:
                raise ValidationError({"detail": "Invalid verification session"})
            if not pv.verified or pv.expires_at < timezone.now():
                raise ValidationError({"detail": "Phone not verified or expired"})
            # Enforce Stripe payment
            stripe_session_id = self.request.data.get("stripe_session_id")
            if not stripe_session_id:
                raise ValidationError({"detail": "Stripe payment required before submission"})
            stripe.api_key = settings.STRIPE_SECRET_KEY
            try:
                session = stripe.checkout.Session.retrieve(stripe_session_id)
                if session.get("payment_status") != "paid":
                    raise ValidationError({"detail": "Payment not completed"})
            except Exception as e:
                raise ValidationError({"detail": f"Stripe error: {str(e)}"})
        serializer.save(author=user, approved=getattr(user, "is_admin", False))

# Create your views here.
