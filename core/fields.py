import base64
import hashlib

from django.conf import settings
from django.core.exceptions import ImproperlyConfigured
from django.db import models

from cryptography.fernet import Fernet, InvalidToken

_fernet_cache: dict = {}


def _derived_key() -> bytes:
    """Deriva una clave Fernet determinística desde SECRET_KEY."""
    secret = settings.SECRET_KEY or "qredirect-insecure"
    digest = hashlib.sha256(secret.encode()).digest()
    return base64.urlsafe_b64encode(digest)


def _get_fernet() -> Fernet:
    """Devuelve una instancia de Fernet (cacheada por clave).

    Usa ``settings.FIELD_ENCRYPTION_KEY`` si está definida; en caso contrario
    deriva una clave desde ``SECRET_KEY``. Si la clave provista es inválida,
    levanta ``ImproperlyConfigured`` para fallar de forma clara en vez de
    crashear con un ``ValueError`` críptico al tocar la base de datos.
    """
    key = getattr(settings, "FIELD_ENCRYPTION_KEY", None)
    resolved = key.encode() if key else _derived_key()

    if resolved not in _fernet_cache:
        try:
            _fernet_cache[resolved] = Fernet(resolved)
        except (ValueError, TypeError) as exc:
            raise ImproperlyConfigured(
                "FIELD_ENCRYPTION_KEY no es una clave Fernet válida. Generá una con: "
                'python -c "from cryptography.fernet import Fernet; '
                'print(Fernet.generate_key().decode())"'
            ) from exc

    return _fernet_cache[resolved]


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
        return _get_fernet().encrypt(value.encode()).decode()

    def from_db_value(self, value, expression, connection):
        if value is None or value == "":
            return value
        try:
            return _get_fernet().decrypt(value.encode()).decode()
        except (InvalidToken, ValueError, TypeError):
            return value

    def to_python(self, value):
        value = super().to_python(value)
        if value is None or value == "":
            return value
        try:
            return _get_fernet().decrypt(value.encode()).decode()
        except (InvalidToken, ValueError, TypeError):
            return value
