from rest_framework import permissions

class IsAdminOrOwner(permissions.BasePermission):
    """
    Custom permission to allow access to admin or owner of the object
    """
    def has_object_permission(self, request, view, obj):
        return request.user.is_authenticated and (request.user.is_admin or obj.user == request.user)
