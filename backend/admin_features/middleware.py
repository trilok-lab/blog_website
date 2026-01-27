# admin_features/middleware.py

from django.http import JsonResponse
from django.utils.deprecation import MiddlewareMixin


class AdminOnlyAPIMiddleware(MiddlewareMixin):
    """
    STRICT admin protection middleware.

    Rules:
    - Public APIs are ALWAYS allowed
    - Only /api/admin/** is restricted
    - Comments & articles are NEVER blocked for GET
    """

    PUBLIC_API_PREFIXES = (
        "api/articles",
        "api/comments",
        "api/contact",
        "api/auth",
    )

    ADMIN_API_PREFIX = "api/admin"

    def process_view(self, request, view_func, view_args, view_kwargs):
        path = (request.path or "").lstrip("/")  # normalize

        # -------------------------------
        # ✅ ALWAYS ALLOW PUBLIC APIs
        # -------------------------------
        for prefix in self.PUBLIC_API_PREFIXES:
            if path == prefix or path.startswith(prefix + "/"):
                return None

        # -------------------------------
        # 🔒 ADMIN API ONLY
        # -------------------------------
        if path == self.ADMIN_API_PREFIX or path.startswith(self.ADMIN_API_PREFIX + "/"):
            user = request.user

            if not user.is_authenticated:
                return JsonResponse(
                    {"detail": "Authentication required"},
                    status=401
                )

            if not (
                getattr(user, "is_admin", False)
                or user.is_staff
                or user.is_superuser
            ):
                return JsonResponse(
                    {"detail": "Admin access required"},
                    status=403
                )

        return None
