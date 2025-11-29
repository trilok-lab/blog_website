# admin_features/middleware.py

from django.http import JsonResponse
from django.utils.deprecation import MiddlewareMixin


class AdminOnlyAPIMiddleware(MiddlewareMixin):
    """
    Enforces admin access for all URLs under /api/admin/
    Works reliably regardless of whether request.path includes a leading slash.
    """

    def process_view(self, request, view_func, view_args, view_kwargs):
        path = (request.path or "").lstrip("/")  # normalize path (remove leading slash)

        # Check if the path targets admin API
        if path.startswith("api/admin/"):
            user = request.user

            if not user.is_authenticated:
                return JsonResponse({"detail": "Authentication required"}, status=401)

            # Check any valid admin flag
            if not (
                getattr(user, "is_admin", False)
                or user.is_staff
                or user.is_superuser
            ):
                return JsonResponse({"detail": "Admin access required"}, status=403)

        return None
