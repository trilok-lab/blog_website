from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsOwnerOrAdminCanEdit(BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True
        if request.user and request.user.is_authenticated and getattr(request.user, "is_admin", False):
            return True
        return obj.author == request.user


