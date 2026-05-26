from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from core.models.shorturl import ShortUrl
from core.serializers.shorturl import ShortUrlSerializer
from users.permissions import IsOwnerOrAdmin


class ShortUrlViewSet(viewsets.ModelViewSet):
    serializer_class = ShortUrlSerializer

    def get_permissions(self):
        if self.action in ("retrieve", "update", "partial_update", "destroy"):
            return [IsAuthenticated(), IsOwnerOrAdmin()]
        return [IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user
        if user.role == "ADMIN":
            return ShortUrl.objects.all().order_by("-created_at")
        return ShortUrl.objects.filter(user=user).order_by("-created_at")

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        instance = self.get_object()
        serializer.save(user=instance.user)