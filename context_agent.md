# Contexto del Proyecto QRedirect - Estado Actual

## Qué es el proyecto
Plataforma web para gestionar códigos QR dinámicos y URLs cortas con estadísticas de escaneos/clics.
- Usuarios crean QRs que redirigen a diferentes destinos (web, email, teléfono, WhatsApp, mapa, texto)
- Sistema registra cada escaneo/clic con detalles (IP, país, dispositivo, navegador)
- Dashboard de estadísticas por usuario

## Estructura del proyecto
- **QRedirect/**: Configuración del proyecto Django (settings, urls, wsgi/asgi)
- **core/**: App principal con modelos QRCode, QRScanEvent, ShortUrl, ShortUrlClickEvent
- **users/**: App de usuarios con modelo User (AbstractUser + role), autenticación y permisos
- **Frontend**: React/Next.js esperado en `http://localhost:3000` (CORS configurado)
- **Base de datos**: PostgreSQL (Programacion1) mediante `.env`

## Qué se ha hecho hasta ahora

### 1. Configuración Django
- ✅ Proyecto scaffolding completado
- ✅ PostgreSQL configurado vía variables de entorno (`.env`)
- ✅ CORS configurado para `http://localhost:3000`
- ✅ DRF configurado con paginación (page_size=20)
- ✅ Swagger/OpenAPI en `/api/docs/`
- ✅ django-allauth configurado para autenticación social

### 2. App users (Paso 1 - Identidad)
- ✅ App `users` creada separada de `core`
- ✅ Modelo `User(AbstractUser)` con campo `role` (ADMIN / USER)
- ✅ `AUTH_USER_MODEL = 'users.User'` en settings.py
- ✅ Serializers: `UserSerializer` (lectura) + `UserCreateSerializer` (registro con password hasheada)
- ✅ ViewSet con permisos: cualquiera crea, admin lista/borra, user ve solo su perfil
- ✅ Admin de Django registrado con `BaseUserAdmin`
- ✅ URLs en `/api/users/`

### 3. Modelos del negocio (core/models/)
- ✅ `QRCode` - slug único, destination_type (WEB/EMAIL/PHONE/WHATSAPP/MAP/TEXT), total_scans
- ✅ `QRScanEvent` - evento de escaneo con IP, país, ciudad, dispositivo, OS, browser
- ✅ `ShortUrl` - slug único, original_url, total_clicks
- ✅ `ShortUrlClickEvent` - evento de clic (mismos campos analytics)
- ✅ Todos con índices en slug y (user, created_at)
- ✅ Migraciones aplicadas en PostgreSQL
- ✅ `qr_image_path` eliminado: el QR ya no depende de archivos ni rutas guardadas en disco

### 4. API REST (DRF)
- ✅ Serializers para QRCode, QRScanEvent, ShortUrl, ShortUrlClickEvent
- ✅ Viewsets con permisos de owner (solo dueño o admin pueden modificar/borrar)
- ✅ URLs registradas: `/api/qr/`, `/api/shorturl/`
- ✅ Filtro por usuario: cada user ve solo sus propios recursos (admin ve todos)
- ✅ Nuevo endpoint `GET /api/qr/{id}/image/` que devuelve el PNG del QR generado al vuelo
- ✅ El serializer de QR expone `qr_redirect_url` y `qr_image_url` en vez de una ruta de archivo

### 5. Autenticación JWT (Paso 2)
- ✅ `djangorestframework-simplejwt==5.5.1` instalado
- ✅ `JWTAuthentication` como default en DRF
- ✅ `POST /api/token/` → login devuelve access + refresh token
- ✅ `POST /api/token/refresh/` → renovar access token
- ✅ Access token: 30 min | Refresh token: 1 día
- ✅ Header esperado: `Authorization: Bearer <token>`

### 6. Control de Acceso (Paso 3 - RBAC)
- ✅ `users/permissions.py` con:
  - `IsAdmin` → solo usuarios con role=ADMIN
  - `IsOwnerOrAdmin` → dueño del recurso o admin
- ✅ Permisos por acción en cada ViewSet:
  - QRCode/ShortUrl: list/create cualquiera auth, retrieve/update/delete solo owner o admin
  - Users: create cualquiera, list/destroy solo admin, retrieve/update solo owner o admin

### 7. Base de datos
- ✅ PostgreSQL 16, BD: Programacion1
- ✅ Usuario: programacion1
- ✅ BD reseteada y migrada desde cero
- ✅ Admin creado: admin / admin (role=ADMIN)
- ✅ 21 tablas creadas (auth, users, core, allauth, socialaccount, etc.)

### 8. QR dinámico generado al vuelo
- ✅ El QR no se almacena como imagen ni como binario en la base de datos
- ✅ El backend genera el PNG en cada request a partir de la URL pública `/q/{slug}/`
- ✅ Esto evita duplicar datos derivados, reduce el tamaño de la base y mantiene estable el mismo QR mientras el `slug` no cambie
- ✅ Si cambia `destination_value`, el QR sigue siendo válido porque el contenido codificado apunta al redirect dinámico del backend
- ✅ Si cambia el `slug`, el QR cambia, porque cambia la URL pública codificada
- ✅ Se implementó `GET /q/{slug}/` para registrar el escaneo, incrementar `total_scans` y redirigir al destino final

### 9. Flujos de Usuario (Paso 4 - Registro, Perfil, Logout)
- ✅ **Registro** (`POST /api/users/`): Cualquier persona puede crear una cuenta. El role se asigna como `USER` por defecto de forma forzada (el campo es read_only en el serializer). La password se hashea automáticamente con `set_password()`. Esto evita que un usuario malicioso se registre como ADMIN.
- ✅ **Perfil** (`GET/PATCH /api/profile/`): El usuario autenticado puede ver y modificar sus propios datos (nombre, email, etc.). La lógica usa un `@action` personalizado en el ViewSet que devuelve el serializer del usuario autenticado. No se puede cambiar el role desde aquí.
- ✅ **Logout** (`POST /api/logout/`): Invalida el refresh token agregándolo a la blacklist de SimpleJWT. Esto evita que un token robado pueda seguir usándose para renovar access tokens. Requiere `Authorization: Bearer <access_token>` y body `{"refresh": "<refresh_token>"}`.
- ✅ **Blacklist activada**: Se agregó `rest_framework_simplejwt.token_blacklist` a INSTALLED_APPS y se migraron las tablas `token_blacklist_outstandingtoken` y `token_blacklist_blacklistedtoken`.

### 10. Archivos de documentación
- ✅ `README.md`: Especificación completa del proyecto
- ✅ `AGENTS.md`: Guía técnica para desarrolladores
- ✅ `context_agent.md`: Este archivo (resumen de progreso)
- ✅ `.gitignore` actualizado con `user.txt`, `__pycache__/`, `*.pyc`

## Endpoints disponibles

| Método | Endpoint | Permiso | Descripción |
|--------|----------|---------|-------------|
| POST | `/api/token/` | Público | Login (JWT) |
| POST | `/api/token/refresh/` | Público | Renovar access token |
| POST | `/api/users/` | Público | Registrarse (role=USER fijo) |
| GET | `/api/users/` | ADMIN | Listar usuarios |
| GET/PUT | `/api/users/{id}/` | Owner o ADMIN | Ver/editar perfil por ID |
| DELETE | `/api/users/{id}/` | ADMIN | Eliminar usuario |
| GET/PATCH | `/api/profile/` | Autenticado | Ver/editar perfil propio |
| POST | `/api/logout/` | Autenticado | Cerrar sesión (blacklist refresh token) |
| GET | `/api/qr/` | Autenticado | Listar QRs propios |
| POST | `/api/qr/` | Autenticado | Crear QR |
| GET | `/api/qr/{id}/image/` | Owner o ADMIN | Descargar/ver PNG del QR |
| GET/PUT/DELETE | `/api/qr/{id}/` | Owner o ADMIN | Ver/editar/borrar QR |
| GET | `/q/{slug}/` | Público | Registrar escaneo y redirigir destino del QR |
| GET | `/api/shorturl/` | Autenticado | Listar URLs cortas |
| POST | `/api/shorturl/` | Autenticado | Crear URL corta |
| GET/PUT/DELETE | `/api/shorturl/{id}/` | Owner o ADMIN | Ver/editar/borrar |
| GET | `/api/docs/` | Público | Swagger UI |
| GET | `/api/schema/` | Público | OpenAPI schema |

## Roles del sistema

| Rol | Puede |
|-----|-------|
| **ADMIN** | CRUD cualquier recurso, listar/borrar usuarios, ver todo |
| **USER** | Crear y gestionar sus propios QRs y URLs cortas, ver su perfil |

## ¿Por qué JWT en vez de sesiones tradicionales?

JWT es stateless: el servidor firma un token y no necesita almacenar la sesión en BD/memoria. Esto escala horizontalmente sin esfuerzo — cualquier instancia del backend puede validar el token con solo conocer la clave de firma. En QRedirect, donde los QRs pueden recibir millones de escaneos, la autenticación no debe ser un cuello de botella. Las sesiones tradicionales requieren consultar una base de datos o Redis en cada request, lo que agrega latencia y complejidad operativa.

## Próximos pasos sugeridos
1. Lógica de redirección: `/s/{slug}/` → redirigir y registrar ShortUrlClickEvent
2. Dashboard con estadísticas por usuario
3. Tests automatizados
4. Frontend React/Next.js

---
**Estado**: Modelos, API, autenticación JWT, permisos RBAC, flujos de usuario y QR dinámico al vuelo
**Rama**: TP4
**Última actividad**: Refactor QR sin archivo persistido + redirect público `/q/{slug}/`
