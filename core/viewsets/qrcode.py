from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from core.models import QRCode
from core.serializers.qrcode import QRCodeSerializer


class QRCodeViewSet(viewsets.ModelViewSet):
    """
    CRUD de QRCode; los usuarios ven y modifican SOLO sus propios QR.
    El staff puede ver todos (opcional).
    """
    serializer_class = QRCodeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return QRCode.objects.all().order_by("-created_at")
        return QRCode.objects.filter(user=user).order_by("-created_at")

    def perform_create(self, serializer):
        # Fuerza que el QR se cree con el usuario autenticado
        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        # Evita que el cliente cambie la relación owner en un update
        instance = self.get_object()
        serializer.save(user=instance.user)