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
    search_fields = ('name', 'slug', 'user__username')
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

