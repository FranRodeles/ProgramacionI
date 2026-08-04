from io import BytesIO
from urllib.parse import quote

import qrcode
from django.urls import reverse


def build_qr_redirect_path(qr_code):
    return reverse("qr-redirect", kwargs={"slug": qr_code.slug})


def build_qr_redirect_url(request, qr_code):
    path = build_qr_redirect_path(qr_code)
    return request.build_absolute_uri(path)


def build_qr_png_bytes(content):
    qr = qrcode.QRCode(box_size=10, border=4)
    qr.add_data(content)
    qr.make(fit=True)

    image = qr.make_image(fill_color="black", back_color="white")
    buffer = BytesIO()
    image.save(buffer, format="PNG")
    return buffer.getvalue()


def resolve_qr_destination(qr_code):
    value = qr_code.destination_value.strip()

    if qr_code.destination_type == "WEB":
        if value.startswith(("http://", "https://")):
            return value
        return f"https://{value}"

    if qr_code.destination_type == "EMAIL":
        if value.startswith("mailto:"):
            return value
        return f"mailto:{value}"

    if qr_code.destination_type == "PHONE":
        if value.startswith("tel:"):
            return value
        return f"tel:{value}"

    if qr_code.destination_type == "WHATSAPP":
        if value.startswith(("http://", "https://")):
            return value
        return f"https://wa.me/{value}"

    if qr_code.destination_type == "MAP":
        if value.startswith(("http://", "https://")):
            return value
        return f"https://www.google.com/maps/search/?api=1&query={quote(value)}"

    return None
