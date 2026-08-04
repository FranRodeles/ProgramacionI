from rest_framework import serializers

from core.models.qrcode import QRCode, QRScanEvent
from core.qr_utils import build_qr_redirect_path


class QRCodeSerializer(serializers.ModelSerializer):
    """Serializer para CRUD de codigos QR."""

    user_username = serializers.CharField(source="user.username", read_only=True)
    qr_redirect_url = serializers.SerializerMethodField()
    qr_image_url = serializers.SerializerMethodField()

    class Meta:
        model = QRCode
        fields = (
            "id",
            "user",
            "user_username",
            "name",
            "slug",
            "destination_type",
            "destination_value",
            "is_active",
            "qr_redirect_url",
            "qr_image_url",
            "total_scans",
            "created_at",
            "updated_at",
        )
        read_only_fields = (
            "id",
            "user",
            "total_scans",
            "created_at",
            "updated_at",
            "user_username",
        )

    def get_qr_redirect_url(self, obj):
        request = self.context.get("request")
        path = build_qr_redirect_path(obj)
        if request is None:
            return path
        return request.build_absolute_uri(path)

    def get_qr_image_url(self, obj):
        request = self.context.get("request")
        path = f"/api/qr/{obj.pk}/image/"
        if request is None:
            return path
        return request.build_absolute_uri(path)


class QRScanEventSerializer(serializers.ModelSerializer):
    """Serializer para eventos de escaneo de QR."""

    qr_slug = serializers.CharField(source="qr_code.slug", read_only=True)

    class Meta:
        model = QRScanEvent
        fields = (
            "id",
            "qr_code",
            "qr_slug",
            "scanned_at",
            "ip_address",
            "country",
            "city",
            "device_type",
            "os",
            "browser",
            "user_agent",
        )
        read_only_fields = ("id", "scanned_at", "qr_slug")
