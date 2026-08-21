from django.test import TestCase
from rest_framework.test import APIClient

from users.models import User


class LogoutViewTest(TestCase):
    """Tests para POST /api/logout/"""

    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser", password="Test123456"
        )
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    def test_missing_refresh_returns_400(self):
        response = self.client.post("/api/logout/", {}, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data["error"], "El campo 'refresh' es requerido")

    def test_invalid_refresh_returns_generic_error(self):
        response = self.client.post(
            "/api/logout/", {"refresh": "token-invalido"}, format="json"
        )
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data["error"], "Token de refresh inválido o expirado")
