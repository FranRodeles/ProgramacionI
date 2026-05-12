from rest_framework import serializers

from core.models.qrcode import QRCode, QRScanEvent


class QRCodeSerializer(serializers.ModelSerializer):
    """Serializer para CRUD de codigos QR."""

    user_username = serializers.CharField(source="user.username", read_only=True)

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
            "qr_image_path",
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
            "qr_image_path",
        )


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
