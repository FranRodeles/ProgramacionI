from django.http import HttpResponse
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from core.models.qrcode import QRCode
from core.qr_utils import build_qr_png_bytes, build_qr_redirect_url
from core.serializers.qrcode import QRCodeSerializer
from users.permissions import IsOwnerOrAdmin

import secrets
import string


def _generate_unique_slug(length=8):
    alphabet = string.ascii_lowercase + string.digits
    while True:
        slug = "".join(secrets.choice(alphabet) for _ in range(length))
        if not QRCode.objects.filter(slug=slug).exists():
            return slug


class QRCodeViewSet(viewsets.ModelViewSet):
    serializer_class = QRCodeSerializer

    def get_permissions(self):
        if self.action in ("retrieve", "update", "partial_update", "destroy", "image", "analytics"):
            return [IsAuthenticated(), IsOwnerOrAdmin()]
        return [IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user
        if user.role == "ADMIN":
            queryset = QRCode.objects.all()
        else:
            queryset = QRCode.objects.filter(user=user)

        search = self.request.query_params.get("search")
        if search:
            queryset = queryset.filter(name__icontains=search.strip())

        ordering = self.request.query_params.get("ordering")
        if ordering in ("total_scans", "-total_scans", "created_at", "-created_at"):
            queryset = queryset.order_by(ordering)
        else:
            queryset = queryset.order_by("-created_at")

        return queryset

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            print("VALIDATION ERRORS:", serializer.errors)
        return super().create(request, *args, **kwargs)

    def perform_create(self, serializer):
        slug = serializer.validated_data.get('slug')
        if not slug:
            slug = _generate_unique_slug()
        serializer.save(user=self.request.user, slug=slug)

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

    @action(detail=True, methods=["get"], permission_classes=[IsAuthenticated, IsOwnerOrAdmin])
    def analytics(self, request, pk=None):
        qr_code = self.get_object()
        events = qr_code.scan_events.all().order_by("-scanned_at")[:100]
        data = [
            {
                "id": ev.id,
                "scanned_at": ev.scanned_at,
                "country": ev.country or "Argentina",
                "city": ev.city or "Mendoza",
                "device_type": ev.device_type or "Desconocido",
                "os": ev.os or "Desconocido",
                "browser": ev.browser or "Desconocido",
            }
            for ev in events
        ]
        return Response({
            "id": qr_code.id,
            "name": qr_code.name,
            "slug": qr_code.slug,
            "total_scans": qr_code.total_scans,
            "events": data,
        })
