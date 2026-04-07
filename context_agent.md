# Contexto del Proyecto QRedirect - Estado Actual

## Qué es el proyecto
Plataforma web para gestionar códigos QR dinámicos y URLs cortas con estadísticas de escaneos/clics.
- Usuarios crean QRs que redirigen a diferentes destinos (web, email, teléfono, WhatsApp, mapa, texto)
- Sistema registra cada escaneo/clic con detalles (IP, país, dispositivo, navegador)
- Dashboard de estadísticas por usuario

## Estructura del proyecto
- **Backend**: Django 6.0.3 + Django REST Framework en `http://localhost:8000`
- **Frontend**: React/Next.js esperado en `http://localhost:3000` (CORS ya configurado)
- **Base de datos**: SQLite3

## Qué se ha hecho hasta ahora

### 1. Configuración Django
- ✅ Proyecto scaffolding completado (estructura base lista)
- ✅ Apps instaladas: `rest_framework`, `corsheaders`, `drf_spectacular`, `core`
- ✅ CORS configurado: solo permite conexiones desde `http://localhost:3000`
- ✅ Admin de Django funcional en `/admin/`

### 2. Archivos de documentación
- ✅ `README.md`: Especificación completa del proyecto (5 modelos, relaciones, funcionalidades)
- ✅ `AGENTS.md`: Guía para futuros agentes (comandos, gotchas, order de implementación)
- ✅ `context_agent.md`: Este archivo (resumen de progreso)

### 3. .gitignore
- ✅ Añadido `user.txt` a ignore

## Qué FALTA por implementar

### Modelos (core/models.py) - VACÍO
Necesita implementarse en este orden:
1. User (id, name, email, password_hash, created_at, updated_at)
2. QRCode (id, user_id, name, slug, destination_type, destination_value, is_active, qr_image_path, total_scans, created_at, updated_at)
3. QRScanEvent (id, qr_code_id, scanned_at, ip_address, country, city, device_type, os, browser, user_agent)
4. ShortUrl (id, user_id, name, slug, original_url, total_clicks, is_active, created_at, updated_at)
5. ShortUrlClickEvent (id, short_url_id, clicked_at, ip_address, country, city, device_type, os, browser, user_agent)

### Vistas (core/views.py) - VACÍO
- Serializers para cada modelo
- ViewSets para CRUD
- Lógica de redirección y registro de eventos

### URLs (QRedirect/urls.py) - SOLO /admin/
- `/q/{slug}/` → Redirigir QR y registrar escaneo
- `/s/{slug}/` → Redirigir URL corta y registrar clic
- `/api/qr/` → CRUD de QRs
- `/api/short-url/` → CRUD de URLs cortas
- Endpoints de autenticación

### DRF + Swagger
- Configurar en settings.py
- Documentación auto-generada en `/api/schema/`

## Notas importantes
- **Typo preservado**: `requeriments.txt` (no `requirements.txt`)
- **Seguridad dev-only**: SECRET_KEY hardcoded, DEBUG=True, ALLOWED_HOSTS vacío (solo para desarrollo)
- **Slugs**: Deben ser URL-safe y únicos (`abc123`)
- **Migraciones**: Siempre hacer `makemigrations` → `migrate` después de cambios en modelos

## Próximos pasos
1. Implementar modelos en `core/models.py`
2. Crear migraciones y ejecutarlas
3. Implementar serializers y viewsets
4. Añadir rutas a `urls.py`
5. Implementar lógica de redirección y registro de eventos

---
**Estado**: En scaffolding, listo para implementar lógica de negocio
**Rama**: tp1
**Última actividad**: Configuración de Django y documentación
