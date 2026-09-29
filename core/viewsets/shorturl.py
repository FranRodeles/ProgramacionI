from drf_spectacular.utils import extend_schema
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from core.models.shorturl import ShortUrl
from core.serializers.shorturl import (
    ShortUrlSerializer,
    ShortUrlAnalyticsEventSerializer,
    ShortUrlAnalyticsResponseSerializer,
)
from core.utils import generate_unique_slug
from users.permissions import IsOwnerOrAdmin


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
            slug = generate_unique_slug(ShortUrl)
        serializer.save(user=self.request.user, slug=slug)

    def perform_update(self, serializer):
        instance = self.get_object()
        serializer.save(user=instance.user)

    @extend_schema(responses={200: ShortUrlAnalyticsResponseSerializer})
    @action(detail=True, methods=["get"], permission_classes=[IsAuthenticated, IsOwnerOrAdmin])
    def analytics(self, request, pk=None):
        short_url = self.get_object()
        events = short_url.click_events.all().order_by("-clicked_at")[:100]
        serialized_events = ShortUrlAnalyticsEventSerializer(events, many=True).data
        return Response({
            "id": short_url.id,
            "name": short_url.name,
            "slug": short_url.slug,
            "total_clicks": short_url.total_clicks,
            "events": serialized_events,
        })