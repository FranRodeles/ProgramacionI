from django.http import HttpResponse
from drf_spectacular.utils import extend_schema
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from core.models.qrcode import QRCode
from core.qr_utils import build_qr_png_bytes, build_qr_redirect_url
from core.serializers.qrcode import (
    QRCodeSerializer,
    QRAnalyticsEventSerializer,
    QRAnalyticsResponseSerializer,
)
from core.utils import generate_unique_slug
from users.permissions import IsOwnerOrAdmin


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

    def perform_create(self, serializer):
        slug = serializer.validated_data.get('slug')
        if not slug:
            slug = generate_unique_slug(QRCode)
        serializer.save(user=self.request.user, slug=slug)

    def perform_update(self, serializer):
        instance = self.get_object()
        serializer.save(user=instance.user)

    @action(detail=True, methods=["get"], permission_classes=[IsAuthenticated])
    def image(self, request, pk=None):
        qr_code = self.get_object()
        png_bytes = build_qr_png_bytes(
            build_qr_redirect_url(request, qr_code),
            customization=qr_code.customization,
        )

        response = HttpResponse(png_bytes, content_type="image/png")
        response["Content-Disposition"] = f'inline; filename="{qr_code.slug}.png"'
        return response

    @extend_schema(responses={200: QRAnalyticsResponseSerializer})
    @action(detail=True, methods=["get"], permission_classes=[IsAuthenticated, IsOwnerOrAdmin])
    def analytics(self, request, pk=None):
        qr_code = self.get_object()
        events = qr_code.scan_events.all().order_by("-scanned_at")[:100]
        serialized_events = QRAnalyticsEventSerializer(events, many=True).data
        return Response({
            "id": qr_code.id,
            "name": qr_code.name,
            "slug": qr_code.slug,
            "total_scans": qr_code.total_scans,
            "events": serialized_events,
        })

