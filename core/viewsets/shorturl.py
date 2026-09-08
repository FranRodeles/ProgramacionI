import secrets
import string
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from core.models.shorturl import ShortUrl
from core.serializers.shorturl import ShortUrlSerializer
from users.permissions import IsOwnerOrAdmin


def _generate_unique_slug(length=8):
    alphabet = string.ascii_lowercase + string.digits
    while True:
        slug = "".join(secrets.choice(alphabet) for _ in range(length))
        if not ShortUrl.objects.filter(slug=slug).exists():
            return slug


class ShortUrlViewSet(viewsets.ModelViewSet):
    serializer_class = ShortUrlSerializer

    def get_permissions(self):
        if self.action in ("retrieve", "update", "partial_update", "destroy", "analytics"):
            return [IsAuthenticated(), IsOwnerOrAdmin()]
        return [IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user
        if user.role == "ADMIN":
            queryset = ShortUrl.objects.all()
        else:
            queryset = ShortUrl.objects.filter(user=user)

        search = self.request.query_params.get("search")
        if search:
            queryset = queryset.filter(name__icontains=search.strip())

        ordering = self.request.query_params.get("ordering")
        if ordering in ("total_clicks", "-total_clicks", "created_at", "-created_at"):
            queryset = queryset.order_by(ordering)
        else:
            queryset = queryset.order_by("-created_at")

        return queryset

    def perform_create(self, serializer):
        slug = serializer.validated_data.get("slug")
        if not slug:
            slug = _generate_unique_slug()
        serializer.save(user=self.request.user, slug=slug)

    def perform_update(self, serializer):
        instance = self.get_object()
        serializer.save(user=instance.user)

    @action(detail=True, methods=["get"], permission_classes=[IsAuthenticated, IsOwnerOrAdmin])
    def analytics(self, request, pk=None):
        short_url = self.get_object()
        events = short_url.click_events.all().order_by("-clicked_at")[:100]
        data = [
            {
                "id": ev.id,
                "clicked_at": ev.clicked_at,
                "country": ev.country or "Argentina",
                "city": ev.city or "Mendoza",
                "device_type": ev.device_type or "Desconocido",
                "os": ev.os or "Desconocido",
                "browser": ev.browser or "Desconocido",
            }
            for ev in events
        ]
        return Response({
            "id": short_url.id,
            "name": short_url.name,
            "slug": short_url.slug,
            "total_clicks": short_url.total_clicks,
            "events": data,
        })