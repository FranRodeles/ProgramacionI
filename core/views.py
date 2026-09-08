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


def _parse_client_info(request):
    ua_string = request.META.get("HTTP_USER_AGENT", "").lower()

    if "tablet" in ua_string or "ipad" in ua_string:
        device_type = "Tablet"
    elif "mobile" in ua_string or "android" in ua_string or "iphone" in ua_string:
        device_type = "Móvil"
    elif ua_string:
        device_type = "Escritorio"
    else:
        device_type = "Desconocido"

    if "windows" in ua_string:
        os_name = "Windows"
    elif "android" in ua_string:
        os_name = "Android"
    elif "iphone" in ua_string or "ipad" in ua_string or "ios" in ua_string:
        os_name = "iOS"
    elif "macintosh" in ua_string or "mac os" in ua_string:
        os_name = "macOS"
    elif "linux" in ua_string:
        os_name = "Linux"
    elif ua_string:
        os_name = "Otro"
    else:
        os_name = "Desconocido"

    if "edg" in ua_string:
        browser = "Edge"
    elif "chrome" in ua_string and "chromium" not in ua_string:
        browser = "Chrome"
    elif "firefox" in ua_string:
        browser = "Firefox"
    elif "safari" in ua_string and "chrome" not in ua_string:
        browser = "Safari"
    elif "opr" in ua_string or "opera" in ua_string:
        browser = "Opera"
    elif ua_string:
        browser = "Otro"
    else:
        browser = "Desconocido"

    country = request.META.get("HTTP_CF_IPCOUNTRY") or "Argentina"
    city = request.META.get("HTTP_CF_IPCITY") or "Mendoza"

    return {
        "device_type": device_type,
        "os": os_name,
        "browser": browser,
        "country": country,
        "city": city,
    }


def _track_request(request, obj, event_model, count_field, relation_name):
    client_info = _parse_client_info(request)
    with transaction.atomic():
        type(obj).objects.filter(pk=obj.pk).update(**{count_field: F(count_field) + 1})
        event_model.objects.create(
            **{
                relation_name: obj,
                "ip_address": request.META.get("REMOTE_ADDR", "127.0.0.1"),
                "user_agent": request.META.get("HTTP_USER_AGENT", ""),
                **client_info,
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
