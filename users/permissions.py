from rest_framework import permissions


class IsAdmin(permissions.BasePermission):
    """Solo usuarios con role ADMIN pueden acceder."""

    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == "ADMIN"


class IsOwnerOrAdmin(permissions.BasePermission):
    """El dueño del recurso o un ADMIN pueden modificarlo/borrarlo.

    Se usa con get_object() para verificar que el user del recurso
    coincida con el usuario autenticado.
    """

    def has_object_permission(self, request, view, obj):
        return obj.user == request.user or request.user.role == "ADMIN"
