from django.db import models


# NOTE: All models follow this pattern:
# 1. User is the owner of QRCodes and ShortUrls
# 2. QRCode/ShortUrl are tracked via Event tables
# 3. Event tables store analytics data (IP, device, location, etc)
# Keep event tables separate from the main entities for query performance


class User(models.Model):
    """
    Represents a registered user in the system.
    
    This is the root entity for QR codes and short URLs.
    Auth is handled by Django's built-in User model (for now).
    TODO: Consider extending Django's User model if custom fields needed.
    """
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    password_hash = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'core_user'

    def __str__(self):
        return self.name


class QRCode(models.Model):
    """
    Represents a dynamic QR code created by a user.
    
    Key concept: The QR does NOT point to the final destination.
    Instead, it points to /q/{slug}/ which logs the scan and redirects.
    This allows:
    - Changing destination after QR is printed
    - Tracking scan analytics
    - Reusing the same QR code
    
    slug: URL-safe unique identifier (e.g., "abc123")
    destination_type: WEB, EMAIL, PHONE, WHATSAPP, MAP, TEXT
    """
    DESTINATION_CHOICES = [
        ('WEB', 'Website'),
        ('EMAIL', 'Email'),
        ('PHONE', 'Phone'),
        ('WHATSAPP', 'WhatsApp'),
        ('MAP', 'Map Location'),
        ('TEXT', 'Text'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='qr_codes')
    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, max_length=50)  # e.g., "abc123"
    destination_type = models.CharField(max_length=10, choices=DESTINATION_CHOICES)
    destination_value = models.TextField()  # URL, email, phone, etc.
    is_active = models.BooleanField(default=True)
    qr_image_path = models.CharField(max_length=500, blank=True)  # Path to generated QR image
    total_scans = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'core_qr_code'
        indexes = [
            models.Index(fields=['slug']),
            models.Index(fields=['user', 'created_at']),
        ]

    def __str__(self):
        return f"{self.name} ({self.slug})"


class QRScanEvent(models.Model):
    """
    Records each QR code scan for analytics.
    
    Separate table keeps QRCode queries fast.
    IP/location data helps with audience analysis.
    """
    qr_code = models.ForeignKey(QRCode, on_delete=models.CASCADE, related_name='scan_events')
    scanned_at = models.DateTimeField(auto_now_add=True)
    ip_address = models.GenericIPAddressField()
    country = models.CharField(max_length=100, blank=True)
    city = models.CharField(max_length=100, blank=True)
    device_type = models.CharField(max_length=50, blank=True)  # mobile, tablet, desktop
    os = models.CharField(max_length=100, blank=True)  # iOS, Android, Windows, etc.
    browser = models.CharField(max_length=100, blank=True)  # Chrome, Safari, Firefox, etc.
    user_agent = models.TextField(blank=True)  # Raw user agent string

    class Meta:
        db_table = 'core_qr_scan_event'
        indexes = [
            models.Index(fields=['qr_code', 'scanned_at']),
            models.Index(fields=['country', 'city']),
        ]

    def __str__(self):
        return f"Scan of {self.qr_code.slug} at {self.scanned_at}"


class ShortUrl(models.Model):
    """
    Represents a short URL created by a user.
    
    Similar to QRCode but for URL redirects.
    slug: URL-safe identifier (e.g., "abc123")
    Redirects at /s/{slug}/ and logs to ShortUrlClickEvent.
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='short_urls')
    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, max_length=50)
    original_url = models.URLField(max_length=2000)
    total_clicks = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'core_short_url'
        indexes = [
            models.Index(fields=['slug']),
            models.Index(fields=['user', 'created_at']),
        ]

    def __str__(self):
        return f"{self.name} ({self.slug})"


class ShortUrlClickEvent(models.Model):
    """
    Records each click on a short URL.
    
    Separate table for performance. Same analytics data as QRScanEvent.
    """
    short_url = models.ForeignKey(ShortUrl, on_delete=models.CASCADE, related_name='click_events')
    clicked_at = models.DateTimeField(auto_now_add=True)
    ip_address = models.GenericIPAddressField()
    country = models.CharField(max_length=100, blank=True)
    city = models.CharField(max_length=100, blank=True)
    device_type = models.CharField(max_length=50, blank=True)
    os = models.CharField(max_length=100, blank=True)
    browser = models.CharField(max_length=100, blank=True)
    user_agent = models.TextField(blank=True)

    class Meta:
        db_table = 'core_short_url_click_event'
        indexes = [
            models.Index(fields=['short_url', 'clicked_at']),
            models.Index(fields=['country', 'city']),
        ]

    def __str__(self):
        return f"Click of {self.short_url.slug} at {self.clicked_at}"
