# QRedirect Agent Guide

## Project Overview
**QRedirect** is a Django + DRF REST API for dynamic QR codes and short URLs with analytics.
- Backend: Django 6.0.3 with Django REST Framework
- Frontend: React/Next.js at `http://localhost:3000` (CORS configured)
- Database: SQLite3 (`db.sqlite3`)
- Status: Scaffolding complete, business logic pending (models, views empty)

## Setup & Commands

### Environment
```bash
# Activate venv (required before any command)
source .venv/bin/activate

# Install dependencies (if needed)
pip install -r requeriments.txt  # Note: typo "requeriments" preserved in repo
```

### Django Management
```bash
# Run development server on http://localhost:8000
python manage.py runserver

# Create new migration after model changes
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Create superuser for admin panel
python manage.py createsuperuser

# Access admin at http://localhost:8000/admin/
```

### Testing
- No test files exist yet; create in `core/tests.py` following Django conventions
- Run tests: `python manage.py test`

## Key Architectural Notes

### App Structure
- **QRedirect/**: Project config (Django settings, URLs, WSGI/ASGI)
- **core/**: Main app (currently empty scaffolding)
- Single app design—do not create additional apps unless needed

### Critical Fixtures
1. **CORS Middleware ordering**: `corsheaders.middleware.CorsMiddleware` must appear BEFORE `django.middleware.common.CommonMiddleware` in settings.py (currently correct)
2. **CORS allowed**: Only `http://localhost:3000` is whitelisted
3. **DRF + Swagger**: `rest_framework` and `drf_spectacular` installed but not yet configured in settings
4. **Default admin**: Basic Django admin is configured and accessible

### Security Issues (Known, for dev only)
- SECRET_KEY is hardcoded and exposed in settings.py (line 23)
- DEBUG = True in settings.py (line 26)
- ALLOWED_HOSTS empty (line 28)
- These are intentionally dev-only; do not commit to production as-is

## Model Implementation (Critical Path)

Per README.md, implement these models in `core/models.py` in order:
1. **User** → id, name, email, password_hash, created_at, updated_at
2. **QRCode** → id, user_id, name, slug (unique), destination_type (choices: WEB, EMAIL, PHONE, WHATSAPP, MAP, TEXT), destination_value, is_active, qr_image_path, total_scans, created_at, updated_at
3. **QRScanEvent** → id, qr_code_id, scanned_at, ip_address, country, city, device_type, os, browser, user_agent
4. **ShortUrl** → id, user_id, name, slug (unique), original_url, total_clicks, is_active, created_at, updated_at
5. **ShortUrlClickEvent** → id, short_url_id, clicked_at, ip_address, country, city, device_type, os, browser, user_agent

Key constraint: `slug` fields must be URL-safe unique identifiers (e.g., `abc123`).

## URL Routing

**Current state**: `QRedirect/urls.py` only has `/admin/`. 

Add API endpoints pattern (to be implemented):
- QR CRUD: `/api/qr/`, `/api/qr/{id}/`
- Redirect logic: `/q/{slug}/` (triggers QRScanEvent logging and redirect)
- Short URL redirect: `/s/{slug}/` (triggers ShortUrlClickEvent logging and redirect)
- User auth endpoints per DRF conventions

## Common Pitfalls

1. **Typo in dependencies**: `requeriments.txt` not `requirements.txt`—keep the typo in filenames
2. **INSTALLED_APPS order**: `'core'` must be after Django apps but DRF apps order doesn't matter
3. **Migrations**: Always run `makemigrations` → `migrate` sequence after model edits
4. **Empty models**: `core/models.py` and `core/views.py` are placeholders; agents often overlook that nothing is implemented
5. **No URL routes**: Adding models won't expose endpoints without adding serializers, viewsets, and URL patterns

## Frontend Integration

Frontend expects:
- API base URL: `http://localhost:8000/api/` (not yet configured in settings)
- CORS headers properly set (confirmed in middleware)
- JSON responses from DRF endpoints

## Git

- `.gitignore` includes `.venv` and `user.txt`
- Recent commits: "Default django app" → "Preparing project"
- Do not track `.venv/` or database snapshots in new commits
