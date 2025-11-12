from django.http import JsonResponse
from django.utils.deprecation import MiddlewareMixin

class AdminOnlyAPIMiddleware(MiddlewareMixin):
    def process_view(self, request, view_func, view_args, view_kwargs):
        path = request.path or ""
        if path.startswith("/api/admin/"):
            user = getattr(request, "user", None)
            if not user or not user.is_authenticated or not (user.is_staff or user.is_superuser):
                return JsonResponse({"detail": "Admin access required."}, status=403)
        return None

