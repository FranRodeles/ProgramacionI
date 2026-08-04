from django.conf import settings
from django.db import models


class QRCode(models.Model):
    """QR dinámico creado por un usuario.

    Relación principal:
    - `user` apunta al dueño del QR.

    Campos importantes:
    - `slug`: identificador público en la URL.
    - `destination_type`: tipo de destino que el QR va a abrir.
    - `destination_value`: contenido real del destino.
    - `total_scans`: contador rápido para estadísticas.
    """

    DESTINATION_TYPES = [
        ("WEB", "Website"),
        ("EMAIL", "Email"),
        ("PHONE", "Phone"),
        ("WHATSAPP", "WhatsApp"),
        ("MAP", "Map"),
        ("TEXT", "Text"),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="qr_codes",
    )
    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, max_length=50)
    destination_type = models.CharField(max_length=10, choices=DESTINATION_TYPES)
    destination_value = models.TextField()
    is_active = models.BooleanField(default=True)
    total_scans = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        """Optimiza búsquedas por slug y por usuario con sus fechas."""
        db_table = "qr_codes"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["slug"]),
            models.Index(fields=["user", "created_at"]),
        ]

    def __str__(self):
        return f"{self.name} ({self.slug})"


class QRScanEvent(models.Model):
    """Evento individual de escaneo de un QR.

    Cada escaneo crea un registro nuevo para poder medir visitas, origen,
    dispositivo y navegador.
    """

    qr_code = models.ForeignKey(
        QRCode,
        on_delete=models.CASCADE,
        related_name="scan_events",
    )
    scanned_at = models.DateTimeField(auto_now_add=True)
    ip_address = models.GenericIPAddressField()
    country = models.CharField(max_length=100, blank=True)
    city = models.CharField(max_length=100, blank=True)
    device_type = models.CharField(max_length=50, blank=True)
    os = models.CharField(max_length=100, blank=True)
    browser = models.CharField(max_length=100, blank=True)
    user_agent = models.TextField(blank=True)

    class Meta:
        """Ordena por fecha y acelera reportes por QR y ubicación."""
        db_table = "qr_scan_events"
        ordering = ["-scanned_at"]
        indexes = [
            models.Index(fields=["qr_code", "scanned_at"]),
            models.Index(fields=["country", "city"]),
        ]

    def __str__(self):
        return f"Scan {self.qr_code.slug} at {self.scanned_at}"
