from rest_framework import viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser

from core.models.user import User
from core.serializers.user import UserSerializer, UserCreateSerializer


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by("-created_at")

    def get_permissions(self):
        if self.action == "create":
            return [AllowAny()]
        if self.action == "list":
            return [IsAdminUser()]
        return [IsAuthenticated()]

    def get_serializer_class(self):
        if self.action == "create":
            return UserCreateSerializer
        return UserSerializer

    def get_queryset(self):
        user = self.request.user
        if not user or not user.is_authenticated:
            return User.objects.none()
        if user.is_staff:
            return User.objects.all().order_by("-created_at")
        return User.objects.filter(pk=user.pk)