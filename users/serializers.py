from django.contrib.auth.password_validation import validate_password as django_validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework import serializers
from users.models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            "id",
            "username",
            "first_name",
            "last_name",
            "email",
            "role",
            "is_active",
            "is_staff",
            "created_at",
            "updated_at",
        )
        read_only_fields = (
            "id",
            "role",
            "is_active",
            "is_staff",
            "created_at",
            "updated_at",
        )

    def validate_email(self, value):
        cleaned = (value or "").strip()
        if not cleaned:
            return cleaned
        qs = User.objects.filter(email__iexact=cleaned)
        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise serializers.ValidationError("Este correo electrónico ya está registrado.")
        return cleaned


class UserCreateSerializer(serializers.ModelSerializer):
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

    def validate_email(self, value):
        cleaned = (value or "").strip()
        if cleaned and User.objects.filter(email__iexact=cleaned).exists():
            raise serializers.ValidationError("Este correo electrónico ya está registrado.")
        return cleaned

    def validate_password(self, value):
        user = User(
            username=self.initial_data.get("username", ""),
            first_name=self.initial_data.get("first_name", ""),
            last_name=self.initial_data.get("last_name", ""),
            email=self.initial_data.get("email", ""),
        )
        try:
            django_validate_password(value, user=user)
        except DjangoValidationError as exc:
            raise serializers.ValidationError(list(exc.messages)) from exc
        return value

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User(role=User.Role.USER, **validated_data)
        user.set_password(password)
        user.save()
        return user
