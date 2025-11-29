# admin_features/permissions.py
from rest_framework.permissions import BasePermission

class IsAdminUserStrict(BasePermission):
    """
    Strict admin role: user.is_admin OR is_staff OR is_superuser
    """

    def has_permission(self, request, view):
        user = request.user
        return bool(
            user and user.is_authenticated and (user.is_admin or user.is_staff or user.is_superuser)
        )
