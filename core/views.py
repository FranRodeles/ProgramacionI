from django.db import transaction
from django.db.models import F
from django.http import Http404, HttpResponse
from django.shortcuts import redirect

from core.models.qrcode import QRCode, QRScanEvent
from core.models.shorturl import ShortUrl, ShortUrlClickEvent
from core.qr_utils import resolve_qr_destination


def qr_redirect(request, slug):
    try:
        qr_code = QRCode.objects.get(slug=slug, is_active=True)
    except QRCode.DoesNotExist as exc:
        raise Http404("QR no encontrado o inactivo") from exc

    with transaction.atomic():
        QRCode.objects.filter(pk=qr_code.pk).update(total_scans=F("total_scans") + 1)
        QRScanEvent.objects.create(
            qr_code=qr_code,
            ip_address=request.META.get("REMOTE_ADDR", "127.0.0.1"),
            user_agent=request.META.get("HTTP_USER_AGENT", ""),
        )

    destination = resolve_qr_destination(qr_code)
    if qr_code.destination_type == "TEXT":
        return HttpResponse(qr_code.destination_value, content_type="text/plain; charset=utf-8")

    return redirect(destination)


def shorturl_redirect(request, slug):
    try:
        short_url = ShortUrl.objects.get(slug=slug, is_active=True)
    except ShortUrl.DoesNotExist as exc:
        raise Http404("URL corta no encontrada o inactiva") from exc

    with transaction.atomic():
        ShortUrl.objects.filter(pk=short_url.pk).update(total_clicks=F("total_clicks") + 1)
        ShortUrlClickEvent.objects.create(
            short_url=short_url,
            ip_address=request.META.get("REMOTE_ADDR", "127.0.0.1"),
            user_agent=request.META.get("HTTP_USER_AGENT", ""),
        )

    return redirect(short_url.original_url)
