from django.urls import path
from rest_framework.routers import DefaultRouter

from core.viewsets.qrcode import QRCodeViewSet
from core.viewsets.shorturl import ShortUrlViewSet

app_name = "core"

router = DefaultRouter()
router.register(r"qr", QRCodeViewSet, basename="qr")
router.register(r"shorturl", ShortUrlViewSet, basename="shorturl")

urlpatterns = router.urls
