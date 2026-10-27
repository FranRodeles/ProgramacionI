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


class UserSecurityTest(TestCase):
    """Tests de seguridad para prevención de escalada de privilegios y registro."""

    def setUp(self):
        self.user = User.objects.create_user(
            username="normaluser",
            email="normal@example.com",
            password="StrongPassword123!",
        )
        self.client = APIClient()

    def test_cannot_escalate_role_via_profile_patch(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.patch(
            "/api/profile/", {"role": "ADMIN", "first_name": "Nuevo"}, format="json"
        )
        self.assertEqual(response.status_code, 200)
        self.user.refresh_from_db()
        self.assertEqual(self.user.role, User.Role.USER)
        self.assertEqual(self.user.first_name, "Nuevo")

    def test_register_rejects_weak_numeric_password(self):
        response = self.client.post(
            "/api/users/",
            {
                "username": "weakuser",
                "email": "weak@example.com",
                "password": "12345678",
            },
            format="json",
        )
        self.assertEqual(response.status_code, 400)
        self.assertIn("password", response.data)

    def test_register_rejects_duplicate_email(self):
        response = self.client.post(
            "/api/users/",
            {
                "username": "anotheruser",
                "email": "NORMAL@example.com",
                "password": "StrongPassword123!",
            },
            format="json",
        )
        self.assertEqual(response.status_code, 400)
        self.assertIn("email", response.data)
