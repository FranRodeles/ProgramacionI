from django.contrib import admin
from core.models.qrcode import QRCode, QRScanEvent
from core.models.shorturl import ShortUrl, ShortUrlClickEvent


@admin.register(QRCode)
class QRCodeAdmin(admin.ModelAdmin):
    """Admin para códigos QR dinámicos.

    Permite ver y editar QRs creados por usuarios,
    filtrar por tipo de destino y búsqueda por slug.
    """

    list_display = ('name', 'slug', 'user', 'destination_type', 'total_scans', 'is_active', 'created_at')
    list_filter = ('destination_type', 'is_active', 'created_at')
    list_select_related = ('user',)
    search_fields = ('name', 'slug', 'user__username')
    ordering = ('-created_at',)
    readonly_fields = ('total_scans', 'created_at', 'updated_at')
    fieldsets = (
        ('Info General', {
            'fields': ('user', 'name', 'slug', 'is_active')
        }),
        ('Destino', {
            'fields': ('destination_type', 'destination_value')
        }),
        ('Estadísticas', {
            'fields': ('total_scans',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(ShortUrl)
class ShortUrlAdmin(admin.ModelAdmin):
    """Admin para URLs cortas."""

    list_display = ('name', 'slug', 'user', 'original_url', 'total_clicks', 'is_active', 'created_at')
    list_filter = ('is_active', 'created_at')
    list_select_related = ('user',)
    search_fields = ('name', 'slug', 'user__username', 'original_url')
    ordering = ('-created_at',)
    readonly_fields = ('total_clicks', 'created_at', 'updated_at')


@admin.register(QRScanEvent)
class QRScanEventAdmin(admin.ModelAdmin):
    """Admin para eventos de escaneo de códigos QR."""

    list_display = ('qr_code', 'scanned_at', 'country', 'city', 'device_type', 'os', 'browser')
    list_filter = ('country', 'device_type', 'os', 'browser', 'scanned_at')
    list_select_related = ('qr_code',)
    search_fields = ('qr_code__name', 'qr_code__slug', 'country', 'city')
    readonly_fields = ('qr_code', 'scanned_at', 'ip_address', 'country', 'city', 'device_type', 'os', 'browser', 'user_agent')


@admin.register(ShortUrlClickEvent)
class ShortUrlClickEventAdmin(admin.ModelAdmin):
    """Admin para eventos de clics en URLs cortas."""

    list_display = ('short_url', 'clicked_at', 'country', 'city', 'device_type', 'os', 'browser')
    list_filter = ('country', 'device_type', 'os', 'browser', 'clicked_at')
    list_select_related = ('short_url',)
    search_fields = ('short_url__name', 'short_url__slug', 'country', 'city')
    readonly_fields = ('short_url', 'clicked_at', 'ip_address', 'country', 'city', 'device_type', 'os', 'browser', 'user_agent')
