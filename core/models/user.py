from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """Usuario base del sistema.

    Hereda de Django `AbstractUser`, por lo que ya incluye autenticación,
    contraseña hasheada, username, email, permisos, grupos y campos de
    administración como `is_staff` e `is_superuser`.

    Los campos agregados aquí sirven para saber cuándo se creó y cuándo se
    actualizó el usuario.
    """
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        """Guarda los usuarios en una tabla simple y los ordena por fecha."""
        db_table = "users"
        ordering = ["-created_at"]
