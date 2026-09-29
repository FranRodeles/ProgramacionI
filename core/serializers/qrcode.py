import re
from django.utils.text import slugify
from rest_framework import serializers

from core.models.qrcode import QRCode, QRScanEvent
from core.qr_utils import build_qr_redirect_path, build_qr_image_path


class QRCodeSerializer(serializers.ModelSerializer):
    """Serializer para CRUD de codigos QR."""

    user_username = serializers.CharField(source="user.username", read_only=True)
    qr_redirect_url = serializers.SerializerMethodField()
    qr_image_url = serializers.SerializerMethodField()
    slug = serializers.CharField(required=False, allow_blank=True, max_length=50)

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
            "customization",
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

    def validate_slug(self, value):
        instance = getattr(self, "instance", None)
        if not value or not value.strip():
            if instance:
                return instance.slug
            return ""
        cleaned = slugify(value.strip())
        if not cleaned:
            raise serializers.ValidationError("El enlace personalizado ingresado no es válido.")
        qs = QRCode.objects.filter(slug=cleaned)
        if instance:
            qs = qs.exclude(pk=instance.pk)
        if qs.exists():
            raise serializers.ValidationError("Este enlace personalizado ya está en uso. Por favor elegí otro.")
        return cleaned

    def validate_customization(self, value):
        if not isinstance(value, dict):
            return value
        logo = value.get("logo")
        if logo and isinstance(logo, str):
            # Base64 para ~500 KB excede los 750.000 caracteres
            if len(logo) > 800_000:
                raise serializers.ValidationError("El logo no debe superar los 500 KB.")
        return value

    def validate(self, attrs):
        dest_type = attrs.get("destination_type", getattr(self.instance, "destination_type", None))
        dest_value = attrs.get("destination_value", getattr(self.instance, "destination_value", None))
        if dest_type == "WHATSAPP":
            digits = re.sub(r"[^\d]", "", dest_value or "")
            if not digits and not (dest_value or "").startswith(("http://", "https://")):
                raise serializers.ValidationError({"destination_value": "Ingresá un número de WhatsApp válido."})
        return attrs

    def get_qr_redirect_url(self, obj):
        request = self.context.get("request")
        path = build_qr_redirect_path(obj)
        if request is None:
            return path
        return request.build_absolute_uri(path)

    def get_qr_image_url(self, obj):
        request = self.context.get("request")
        path = build_qr_image_path(obj)
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


class QRAnalyticsEventSerializer(serializers.ModelSerializer):
    """Serializer para eventos individuales en el endpoint de analíticas de QR."""

    class Meta:
        model = QRScanEvent
        fields = (
            "id",
            "scanned_at",
            "country",
            "city",
            "device_type",
            "os",
            "browser",
        )


class QRAnalyticsResponseSerializer(serializers.Serializer):
    """Schema de respuesta para el endpoint de analíticas de QR."""

    id = serializers.IntegerField()
    name = serializers.CharField()
    slug = serializers.CharField()
    total_scans = serializers.IntegerField()
    events = QRAnalyticsEventSerializer(many=True)

