from rest_framework import serializers

from core.models import ShortUrl, ShortUrlClickEvent


class ShortUrlSerializer(serializers.ModelSerializer):
    """Serializer para CRUD de URLs cortas."""

    user_username = serializers.CharField(source="user.username", read_only=True)

    class Meta:
        model = ShortUrl
        fields = (
            "id",
            "user",
            "user_username",
            "name",
            "slug",
            "original_url",
            "total_clicks",
            "is_active",
            "created_at",
            "updated_at",
        )
        read_only_fields = (
            "id",
            "user",
            "total_clicks",
            "created_at",
            "updated_at",
            "user_username",
        )


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
