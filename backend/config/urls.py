from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path("admin/", admin.site.urls),

    # JWT
    path("auth/jwt/create/", TokenObtainPairView.as_view(), name="jwt-create"),
    path("auth/jwt/refresh/", TokenRefreshView.as_view(), name="jwt-refresh"),

    # Accounts
    path("auth/", include("accounts.urls")),

    # Public APIs
    path("api/articles/", include("articles.urls")),
    path("api/comments/", include("comments.urls")),
    path("api/contact/", include("contact.urls")),
    path("api/theming/", include("theming.urls")),
    path("api/payments/", include("payments.urls")),

    # Admin APIs (protected via middleware)
    path("api/admin/", include("admin_features.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
