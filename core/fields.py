import base64
import hashlib

from django.conf import settings
from django.db import models

from cryptography.fernet import Fernet, InvalidToken


def _encryption_key() -> bytes:
    """Devuelve la clave Fernet para cifrar campos sensibles.

    Prioriza ``settings.FIELD_ENCRYPTION_KEY`` (una clave Fernet en base64).
    Si no está definida, deriva una clave determinística desde ``SECRET_KEY``.
    """
    key = getattr(settings, "FIELD_ENCRYPTION_KEY", None)
    if key:
        return key.encode()
    secret = settings.SECRET_KEY or "qredirect-insecure"
    digest = hashlib.sha256(secret.encode()).digest()
    return base64.urlsafe_b64encode(digest)


class EncryptedTextField(models.TextField):
    """Campo de texto cifrado en reposo.

    Cifra el valor antes de guardarlo en la base de datos y lo descifra al
    leerlo. Los valores legacy en texto plano (registros anteriores a la
    migración) se leen tal cual y se re-cifran en el próximo guardado.
    """

    description = "Campo de texto cifrado en reposo (Fernet)"

    def get_prep_value(self, value):
        value = super().get_prep_value(value)
        if value is None or value == "":
            return value
        return Fernet(_encryption_key()).encrypt(value.encode()).decode()

    def from_db_value(self, value, expression, connection):
        if value is None or value == "":
            return value
        try:
            return Fernet(_encryption_key()).decrypt(value.encode()).decode()
        except (InvalidToken, ValueError, TypeError):
            return value

    def to_python(self, value):
        value = super().to_python(value)
        if value is None or value == "":
            return value
        try:
            return Fernet(_encryption_key()).decrypt(value.encode()).decode()
        except (InvalidToken, ValueError, TypeError):
            return value
