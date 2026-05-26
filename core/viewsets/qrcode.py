from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from core.models.qrcode import QRCode
from core.serializers.qrcode import QRCodeSerializer
from users.permissions import IsOwnerOrAdmin


class QRCodeViewSet(viewsets.ModelViewSet):
    serializer_class = QRCodeSerializer

    def get_permissions(self):
        if self.action in ("retrieve", "update", "partial_update", "destroy"):
            return [IsAuthenticated(), IsOwnerOrAdmin()]
        return [IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user
        if user.role == "ADMIN":
            return QRCode.objects.all().order_by("-created_at")
        return QRCode.objects.filter(user=user).order_by("-created_at")

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        instance = self.get_object()
        serializer.save(user=instance.user)