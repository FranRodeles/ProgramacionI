"""Importaciones de compatibilidad para `core.models`.

La implementación real de los modelos vive en `core/models/` como submódulos
separados. Este archivo reexporta las clases para poder importar desde
`core.models` sin romper la API interna del proyecto.
"""

from core.models.qrcode import QRCode, QRScanEvent
from core.models.shorturl import ShortUrl, ShortUrlClickEvent

__all__ = [
    "QRCode",
    "QRScanEvent",
    "ShortUrl",
    "ShortUrlClickEvent",
]
