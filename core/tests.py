from django.test import TestCase, Client
from rest_framework.test import APIClient

from core.models.qrcode import QRCode, QRScanEvent
from core.models.shorturl import ShortUrl, ShortUrlClickEvent
from users.models import User


class QRCodeImageEndpointTest(TestCase):
    """Tests para GET /api/qr/{id}/image/"""

    def setUp(self):
        self.owner = User.objects.create_user(
            username="owner", password="Test123456"
        )
        self.other = User.objects.create_user(
            username="other", password="Test123456"
        )
        self.admin = User.objects.create_superuser(
            username="admin", password="Test123456", role=User.Role.ADMIN
        )
        self.qr = QRCode.objects.create(
            user=self.owner,
            name="Test QR",
            slug="test-qr",
            destination_type="WEB",
            destination_value="https://example.com",
        )
        self.client = APIClient()

    def test_owner_can_get_image(self):
        self.client.force_authenticate(user=self.owner)
        response = self.client.get(f"/api/qr/{self.qr.pk}/image/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response["Content-Type"], "image/png")

    def test_admin_can_get_image(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.get(f"/api/qr/{self.qr.pk}/image/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response["Content-Type"], "image/png")

    def test_non_owner_gets_404(self):
        self.client.force_authenticate(user=self.other)
        response = self.client.get(f"/api/qr/{self.qr.pk}/image/")
        self.assertEqual(response.status_code, 404)

    def test_unauthenticated_gets_401(self):
        response = self.client.get(f"/api/qr/{self.qr.pk}/image/")
        self.assertEqual(response.status_code, 401)


class QRRedirectTest(TestCase):
    """Tests para GET /q/{slug}/"""

    def setUp(self):
        self.owner = User.objects.create_user(
            username="owner", password="Test123456"
        )
        self.qr = QRCode.objects.create(
            user=self.owner,
            name="Test QR",
            slug="test-redirect",
            destination_type="WEB",
            destination_value="https://example.com",
        )
        self.client = Client()

    def test_active_qr_redirects(self):
        response = self.client.get("/q/test-redirect/")
        self.assertEqual(response.status_code, 302)
        self.assertEqual(response["Location"], "https://example.com")

    def test_scan_registered_on_redirect(self):
        self.client.get("/q/test-redirect/")
        self.qr.refresh_from_db()
        self.assertEqual(self.qr.total_scans, 1)
        self.assertEqual(QRScanEvent.objects.count(), 1)
        event = QRScanEvent.objects.first()
        self.assertEqual(event.qr_code, self.qr)

    def test_inactive_qr_returns_404(self):
        self.qr.is_active = False
        self.qr.save()
        response = self.client.get("/q/test-redirect/")
        self.assertEqual(response.status_code, 404)

    def test_unknown_slug_returns_404(self):
        response = self.client.get("/q/no-existe/")
        self.assertEqual(response.status_code, 404)

    def test_text_type_returns_plain(self):
        self.qr.destination_type = "TEXT"
        self.qr.destination_value = "Hola mundo"
        self.qr.save()
        response = self.client.get("/q/test-redirect/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response["Content-Type"], "text/plain; charset=utf-8")
        self.assertContains(response, "Hola mundo")

    def test_destination_change_reflects_in_redirect(self):
        response = self.client.get("/q/test-redirect/")
        self.assertEqual(response["Location"], "https://example.com")

        self.qr.destination_value = "https://www.google.com"
        self.qr.save()

        response = self.client.get("/q/test-redirect/")
        self.assertEqual(response["Location"], "https://www.google.com")


class QRSerializerDestinationTest(TestCase):
    """Tests para resolve_qr_destination"""

    def setUp(self):
        self.owner = User.objects.create_user(
            username="owner", password="Test123456"
        )

    def _make_qr(self, dest_type, dest_value):
        return QRCode.objects.create(
            user=self.owner,
            name="Test",
            slug="test-dest",
            destination_type=dest_type,
            destination_value=dest_value,
        )

    def test_whatsapp_cleans_special_chars(self):
        from core.qr_utils import resolve_qr_destination

        qr = self._make_qr("WHATSAPP", "+54 9 11 2345-6789")
        result = resolve_qr_destination(qr)
        self.assertEqual(result, "https://wa.me/5491123456789")

    def test_whatsapp_with_url_passthrough(self):
        from core.qr_utils import resolve_qr_destination

        qr = self._make_qr("WHATSAPP", "https://wa.me/5491123456789")
        result = resolve_qr_destination(qr)
        self.assertEqual(result, "https://wa.me/5491123456789")

    def test_unsupported_type_raises_error(self):
        from core.qr_utils import resolve_qr_destination

        qr = self._make_qr("INVALID", "some value")
        with self.assertRaises(ValueError):
            resolve_qr_destination(qr)


class QRCodeSerializerTest(TestCase):
    """Tests para la serialización de un QRCode.

    Detecta el bug de `reverse` no importado en `get_qr_image_url`.
    """

    def setUp(self):
        self.owner = User.objects.create_user(
            username="owner", password="Test123456"
        )
        self.qr = QRCode.objects.create(
            user=self.owner,
            name="Test QR",
            slug="test-serialize",
            destination_type="WEB",
            destination_value="https://example.com",
        )

    def test_serializer_returns_qr_image_url(self):
        from core.serializers.qrcode import QRCodeSerializer

        data = QRCodeSerializer(self.qr).data
        self.assertIn(f"/api/qr/{self.qr.pk}/image/", data["qr_image_url"])

    def test_serializer_returns_qr_redirect_url(self):
        from core.serializers.qrcode import QRCodeSerializer

        data = QRCodeSerializer(self.qr).data
        self.assertEqual(data["qr_redirect_url"], f"/q/{self.qr.slug}/")


class ShortUrlRedirectTest(TestCase):
    """Tests para GET /s/{slug}/"""

    def setUp(self):
        self.owner = User.objects.create_user(
            username="owner", password="Test123456"
        )
        self.short = ShortUrl.objects.create(
            user=self.owner,
            name="Test Short",
            slug="test-short",
            original_url="https://example.com",
        )
        self.client = Client()

    def test_active_shorturl_redirects(self):
        response = self.client.get("/s/test-short/")
        self.assertEqual(response.status_code, 302)
        self.assertEqual(response["Location"], "https://example.com")

    def test_click_registered_on_redirect(self):
        self.client.get("/s/test-short/")
        self.short.refresh_from_db()
        self.assertEqual(self.short.total_clicks, 1)
        self.assertEqual(ShortUrlClickEvent.objects.count(), 1)
        event = ShortUrlClickEvent.objects.first()
        self.assertEqual(event.short_url, self.short)

    def test_inactive_shorturl_returns_404(self):
        self.short.is_active = False
        self.short.save()
        response = self.client.get("/s/test-short/")
        self.assertEqual(response.status_code, 404)

    def test_unknown_slug_returns_404(self):
        response = self.client.get("/s/no-existe/")
        self.assertEqual(response.status_code, 404)
