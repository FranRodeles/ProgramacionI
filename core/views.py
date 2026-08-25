from django.db import transaction
from django.db.models import F
from django.http import Http404, HttpResponse
from django.shortcuts import redirect

from core.models.qrcode import QRCode, QRScanEvent
from core.models.shorturl import ShortUrl, ShortUrlClickEvent
from core.qr_utils import resolve_qr_destination


def _get_active_or_404(model, slug, message):
    try:
        return model.objects.get(slug=slug, is_active=True)
    except model.DoesNotExist as exc:
        raise Http404(message) from exc


def _track_request(request, obj, event_model, count_field, relation_name):
    with transaction.atomic():
        type(obj).objects.filter(pk=obj.pk).update(**{count_field: F(count_field) + 1})
        event_model.objects.create(
            **{
                relation_name: obj,
                "ip_address": request.META.get("REMOTE_ADDR", "127.0.0.1"),
                "user_agent": request.META.get("HTTP_USER_AGENT", ""),
            }
        )


def qr_redirect(request, slug):
    qr_code = _get_active_or_404(QRCode, slug, "QR no encontrado o inactivo")
    _track_request(request, qr_code, QRScanEvent, "total_scans", "qr_code")

    destination = resolve_qr_destination(qr_code)
    if qr_code.destination_type == "TEXT":
        return HttpResponse(qr_code.destination_value, content_type="text/plain; charset=utf-8")

    return redirect(destination)


def shorturl_redirect(request, slug):
    short_url = _get_active_or_404(ShortUrl, slug, "URL corta no encontrada o inactiva")
    _track_request(request, short_url, ShortUrlClickEvent, "total_clicks", "short_url")

    return redirect(short_url.original_url)
