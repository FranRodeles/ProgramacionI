"""URL routing para el app core con router de DRF."""

from django.urls import path
from rest_framework.routers import DefaultRouter

from core.viewsets.qrcode import QRCodeViewSet
from core.viewsets.shorturl import ShortUrlViewSet
from core.viewsets.user import UserViewSet

app_name = "core"

router = DefaultRouter()
router.register(r"qr", QRCodeViewSet, basename="qr")
router.register(r"shorturl", ShortUrlViewSet, basename="shorturl")
router.register(r"users", UserViewSet, basename="users")

urlpatterns = router.urls
