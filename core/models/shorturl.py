from django.conf import settings
from django.db import models


class ShortUrl(models.Model):
    """URL corta creada por un usuario.

    Relación principal:
    - `user` apunta al dueño de la URL corta.

    Campos importantes:
    - `slug`: identificador público en la ruta corta.
    - `original_url`: URL final a la que se redirige.
    - `total_clicks`: contador rápido para el panel.
    """

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="short_urls",
    )
    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, max_length=50)
    original_url = models.URLField(max_length=2000)
    total_clicks = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        """Ordena por fecha y deja índices útiles para búsquedas frecuentes."""
        db_table = "short_urls"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["slug"]),
            models.Index(fields=["user", "created_at"]),
        ]

    def __str__(self):
        return f"{self.name} ({self.slug})"


class ShortUrlClickEvent(models.Model):
    """Evento individual de clic sobre una URL corta.

    Cada clic queda guardado para obtener estadísticas de tráfico y origen.
    """

    short_url = models.ForeignKey(
        ShortUrl,
        on_delete=models.CASCADE,
        related_name="click_events",
    )
    clicked_at = models.DateTimeField(auto_now_add=True)
    ip_address = models.GenericIPAddressField()
    country = models.CharField(max_length=100, blank=True)
    city = models.CharField(max_length=100, blank=True)
    device_type = models.CharField(max_length=50, blank=True)
    os = models.CharField(max_length=100, blank=True)
    browser = models.CharField(max_length=100, blank=True)
    user_agent = models.TextField(blank=True)

    class Meta:
        """Ordena por fecha y acelera reportes por URL y ubicación."""
        db_table = "short_url_click_events"
        ordering = ["-clicked_at"]
        indexes = [
            models.Index(fields=["short_url", "clicked_at"]),
            models.Index(fields=["country", "city"]),
        ]

    def __str__(self):
        return f"Click {self.short_url.slug} at {self.clicked_at}"
