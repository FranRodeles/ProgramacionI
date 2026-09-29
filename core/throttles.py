from rest_framework.throttling import AnonRateThrottle


class AuthRateThrottle(AnonRateThrottle):
    """Limita intentos de login/refresh por IP (anti fuerza bruta)."""

    scope = "auth"


class RegisterRateThrottle(AnonRateThrottle):
    """Limita la creación de cuentas por IP (anti spam de registro)."""

    scope = "register"


class RedirectRateThrottle(AnonRateThrottle):
    """Limita las redirecciones públicas (/q/ y /s/) por IP."""

    scope = "redirect"
