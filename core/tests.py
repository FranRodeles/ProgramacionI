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


class QRCodeSlugTransformationTest(TestCase):
    """Pruebas para transformación y validación amigable de slugs."""

    def setUp(self):
        self.user = User.objects.create_user(
            username="sluguser", password="Test123456"
        )
        QRCode.objects.create(
            user=self.user,
            name="QR Existente",
            slug="ya-existe",
            destination_type="WEB",
            destination_value="https://existente.com",
        )

    def test_slug_with_spaces_is_slugified(self):
        from core.serializers.qrcode import QRCodeSerializer

        serializer = QRCodeSerializer(
            data={
                "name": "Mi Café",
                "slug": "Mi Café 2024!",
                "destination_type": "WEB",
                "destination_value": "https://cafe.com",
            }
        )
        self.assertTrue(serializer.is_valid(), serializer.errors)
        self.assertEqual(serializer.validated_data["slug"], "mi-cafe-2024")

    def test_duplicate_slug_raises_friendly_validation_error(self):
        from core.serializers.qrcode import QRCodeSerializer

        serializer = QRCodeSerializer(
            data={
                "name": "Duplicado",
                "slug": "Ya Existe",
                "destination_type": "WEB",
                "destination_value": "https://duplicado.com",
            }
        )
        self.assertFalse(serializer.is_valid())
        self.assertIn("slug", serializer.errors)
        self.assertIn("ya está en uso", serializer.errors["slug"][0])


class ShortUrlCreationTest(TestCase):
    """Pruebas para creación de ShortUrl y normalización de URLs."""

    def setUp(self):
        self.user = User.objects.create_user(
            username="shortuser", password="Test123456"
        )
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    def test_create_shorturl_without_slug_auto_generates_one(self):
        response = self.client.post(
            "/api/shorturl/",
            {"name": "Google", "original_url": "google.com"},
            format="json",
        )
        self.assertEqual(response.status_code, 201)
        data = response.json()
        self.assertTrue(len(data["slug"]) > 0)
        self.assertEqual(data["original_url"], "https://google.com")
        self.assertIn(f"/s/{data['slug']}/", data["short_url"])

    def test_create_shorturl_with_spaces_in_slug(self):
        response = self.client.post(
            "/api/shorturl/",
            {
                "name": "Mi Tienda",
                "original_url": "https://mitienda.com",
                "slug": "Mi Tienda 2024",
            },
            format="json",
        )
        self.assertEqual(response.status_code, 201)
        data = response.json()
        self.assertEqual(data["slug"], "mi-tienda-2024")
        self.assertIn("/s/mi-tienda-2024/", data["short_url"])


class AnalyticsPermissionsTest(TestCase):
    """Pruebas de permisos de acceso a analíticas (dueño y admin vs otros)."""

    def setUp(self):
        self.owner = User.objects.create_user(
            username="analyst_owner", password="Test123456"
        )
        self.other = User.objects.create_user(
            username="analyst_other", password="Test123456"
        )
        self.admin = User.objects.create_superuser(
            username="analyst_admin", password="Test123456", role=User.Role.ADMIN
        )
        self.qr = QRCode.objects.create(
            user=self.owner,
            name="QR Privado",
            slug="qr-privado",
            destination_type="WEB",
            destination_value="https://privado.com",
            total_scans=1,
        )
        QRScanEvent.objects.create(
            qr_code=self.qr,
            ip_address="192.168.1.50",
            country="Argentina",
            city="Mendoza",
            device_type="Móvil",
        )
        self.client = APIClient()

    def test_owner_can_view_analytics_without_ip(self):
        self.client.force_authenticate(user=self.owner)
        res = self.client.get(f"/api/qr/{self.qr.id}/analytics/")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["total_scans"], 1)
        self.assertEqual(len(data["events"]), 1)
        self.assertNotIn("ip_address", data["events"][0])
        self.assertEqual(data["events"][0]["country"], "Argentina")

    def test_other_user_gets_404(self):
        self.client.force_authenticate(user=self.other)
        res = self.client.get(f"/api/qr/{self.qr.id}/analytics/")
        self.assertEqual(res.status_code, 404)

    def test_admin_can_view_anyone_analytics(self):
        self.client.force_authenticate(user=self.admin)
        res = self.client.get(f"/api/qr/{self.qr.id}/analytics/")
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json()["name"], "QR Privado")


class CodeReviewFixesTest(TestCase):
    """Tests para verificar las correcciones del code review senior."""

    def setUp(self):
        self.user = User.objects.create_user(
            username="reviewer_user", password="Test123456"
        )
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    def test_whatsapp_validation_in_serializer(self):
        from core.serializers.qrcode import QRCodeSerializer

        serializer = QRCodeSerializer(
            data={
                "name": "WhatsApp Malo",
                "destination_type": "WHATSAPP",
                "destination_value": "texto sin numeros",
            }
        )
        self.assertFalse(serializer.is_valid())
        self.assertIn("destination_value", serializer.errors)

        serializer_ok = QRCodeSerializer(
            data={
                "name": "WhatsApp Bueno",
                "destination_type": "WHATSAPP",
                "destination_value": "+54 9 261 1234567",
            }
        )
        self.assertTrue(serializer_ok.is_valid(), serializer_ok.errors)

    def test_slug_preserved_on_update_with_empty_slug(self):
        from core.serializers.qrcode import QRCodeSerializer
        from core.serializers.shorturl import ShortUrlSerializer

        qr = QRCode.objects.create(
            user=self.user,
            name="QR Original",
            slug="slug-original",
            destination_type="WEB",
            destination_value="https://original.com",
        )
        serializer = QRCodeSerializer(instance=qr, data={"name": "QR Modificado", "slug": "   "}, partial=True)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        self.assertEqual(serializer.validated_data["slug"], "slug-original")

        short = ShortUrl.objects.create(
            user=self.user,
            name="Short Original",
            slug="short-original",
            original_url="https://original.com",
        )
        short_serializer = ShortUrlSerializer(instance=short, data={"name": "Short Modificado", "slug": ""}, partial=True)
        self.assertTrue(short_serializer.is_valid(), short_serializer.errors)
        self.assertEqual(short_serializer.validated_data["slug"], "short-original")

    def test_geolocation_fallback_unknown(self):
        from core.views import _parse_client_info
        from django.test import RequestFactory

        rf = RequestFactory()
        req = rf.get("/")
        info = _parse_client_info(req)
        self.assertEqual(info["country"], "Desconocido")
        self.assertEqual(info["city"], "Desconocido")

    def test_invalid_destination_returns_404_not_500(self):
        # Si un QR en BD tuviese valor corrupto de whatsapp
        qr = QRCode.objects.create(
            user=self.user,
            name="Corrupto",
            slug="corrupto-wa",
            destination_type="WHATSAPP",
            destination_value="invalido",
        )
        c = Client()
        response = c.get(f"/q/{qr.slug}/")
        self.assertEqual(response.status_code, 404)

