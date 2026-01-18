# config/urls.py
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path("admin/", admin.site.urls),

    # JWT
    path("api/auth/jwt/create/", TokenObtainPairView.as_view(), name="jwt-create"),
    path("api/auth/jwt/refresh/", TokenRefreshView.as_view(), name="jwt-refresh"),

    # AUTH
    path("api/auth/", include("accounts.urls")),

    # APIs
    path("api/articles/", include("articles.urls")),
    path("api/comments/", include("comments.urls")),
    path("api/contact/", include("contact.urls")),
    path("api/theming/", include("theming.urls")),
    path("api/payments/", include("payments.urls")),
    path("api/admin/", include("admin_features.urls")),
    path("api/notifications/", include("notifications.urls")),
]

# ✅ THIS IS CRITICAL
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
