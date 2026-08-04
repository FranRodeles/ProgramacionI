from django.http import HttpResponse
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated

from core.models.qrcode import QRCode
from core.qr_utils import build_qr_png_bytes, build_qr_redirect_url
from core.serializers.qrcode import QRCodeSerializer
from users.permissions import IsOwnerOrAdmin


class QRCodeViewSet(viewsets.ModelViewSet):
    serializer_class = QRCodeSerializer

    def get_permissions(self):
        if self.action in ("retrieve", "update", "partial_update", "destroy", "image"):
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

    @action(detail=True, methods=["get"], permission_classes=[IsAuthenticated])
    def image(self, request, pk=None):
        qr_code = self.get_object()
        png_bytes = build_qr_png_bytes(build_qr_redirect_url(request, qr_code))

        response = HttpResponse(png_bytes, content_type="image/png")
        response["Content-Disposition"] = f'inline; filename="{qr_code.slug}.png"'
        return response
