from django.core.validators import URLValidator
from django.utils.text import slugify
from rest_framework import serializers

from core.models.shorturl import ShortUrl, ShortUrlClickEvent


class ShortUrlSerializer(serializers.ModelSerializer):
    """Serializer para CRUD de URLs cortas."""

    user_username = serializers.CharField(source="user.username", read_only=True)
    slug = serializers.CharField(required=False, allow_blank=True, max_length=50)
    original_url = serializers.CharField(max_length=2000)
    short_url = serializers.SerializerMethodField()

    class Meta:
        model = ShortUrl
        fields = (
            "id",
            "user",
            "user_username",
            "name",
            "slug",
            "original_url",
            "short_url",
            "total_clicks",
            "is_active",
            "created_at",
            "updated_at",
        )
        read_only_fields = (
            "id",
            "user",
            "short_url",
            "total_clicks",
            "created_at",
            "updated_at",
            "user_username",
        )

    def validate_original_url(self, value):
        url = value.strip()
        if not url.startswith(("http://", "https://")):
            url = f"https://{url}"
        validator = URLValidator(schemes=["http", "https"])
        try:
            validator(url)
        except Exception:
            raise serializers.ValidationError("Ingresá una URL web válida (ej: https://ejemplo.com).")
        return url

    def get_short_url(self, obj):
        request = self.context.get("request")
        path = f"/s/{obj.slug}/"
        if request is None:
            return path
        return request.build_absolute_uri(path)

    def validate_slug(self, value):
        if not value or not value.strip():
            return ""
        cleaned = slugify(value.strip())
        if not cleaned:
            raise serializers.ValidationError("El enlace personalizado ingresado no es válido.")
        instance = getattr(self, "instance", None)
        qs = ShortUrl.objects.filter(slug=cleaned)
        if instance:
            qs = qs.exclude(pk=instance.pk)
        if qs.exists():
            raise serializers.ValidationError("Este enlace personalizado ya está en uso. Por favor elegí otro.")
        return cleaned


class ShortUrlClickEventSerializer(serializers.ModelSerializer):
    """Serializer para eventos de click de URL corta."""

    short_slug = serializers.CharField(source="short_url.slug", read_only=True)

    class Meta:
        model = ShortUrlClickEvent
        fields = (
            "id",
            "short_url",
            "short_slug",
            "clicked_at",
            "ip_address",
            "country",
            "city",
            "device_type",
            "os",
            "browser",
            "user_agent",
        )
        read_only_fields = ("id", "clicked_at", "short_slug")
