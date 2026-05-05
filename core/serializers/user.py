from rest_framework import serializers

from core.models import User


class UserSerializer(serializers.ModelSerializer):
    """Serializer de lectura para usuarios."""

    class Meta:
        model = User
        fields = (
            "id",
            "username",
            "first_name",
            "last_name",
            "email",
            "is_active",
            "is_staff",
            "created_at",
            "updated_at",
        )
        read_only_fields = (
            "id",
            "is_active",
            "is_staff",
            "created_at",
            "updated_at",
        )


class UserCreateSerializer(serializers.ModelSerializer):
    """Serializer de creación de usuarios con password hasheada."""

    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = (
            "id",
            "username",
            "first_name",
            "last_name",
            "email",
            "password",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "created_at", "updated_at")

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user
