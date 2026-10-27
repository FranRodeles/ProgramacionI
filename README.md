# QRedirect — Plataforma de Códigos QR Dinámicos y Acortador de URLs

**QRedirect** es una plataforma web full-stack para generar, personalizar, administrar y analizar **códigos QR dinámicos** y **enlaces cortos (Short URLs)**.

A diferencia de los códigos QR estáticos tradicionales, cada QR en QRedirect apunta a una ruta intermedia corta (`/q/<slug>/`). Esto permite **modificar el destino en tiempo real sin necesidad de reimprimir el código**, pausar o reactivar campañas al instante y recolectar métricas detalladas de cada interacción preservando la privacidad de los visitantes.

---

## Tabla de Contenidos

1. [Documentación Técnica, UML y Postman (`docs/`)](#1-documentación-técnica-uml-y-postman-docs)
2. [Características Principales](#2-características-principales)
3. [Stack Tecnológico](#3-stack-tecnológico)
4. [Arquitectura y Estructura del Proyecto](#4-arquitectura-y-estructura-del-proyecto)
5. [Modelo de Datos](#5-modelo-de-datos)
6. [Seguridad y Ciberseguridad](#6-seguridad-y-ciberseguridad)
7. [Endpoints de la API](#7-endpoints-de-la-api)
8. [Instalación y Ejecución en Local](#8-instalación-y-ejecución-en-local)
9. [Ejecución de Tests y Linter](#9-ejecución-de-tests-y-linter)
10. [Despliegue en Producción (Railway + Vercel)](#10-despliegue-en-producción-railway--vercel)

---

## 1. Documentación Técnica, UML y Postman (`docs/`)

Toda la documentación de diseño, diagramas UML y pruebas de API se encuentra en la carpeta [`docs/`](./docs/README.md):

| Recurso | Archivo | Descripción |
| :--- | :--- | :--- |
| **Guía de Documentación** | [`docs/README.md`](./docs/README.md) | Instrucciones para visualizar los diagramas `.puml` e importar la colección en Postman. |
| **Diagrama de Clases UML** | [`docs/qredirect.puml`](./docs/qredirect.puml) | Modelo de dominio en PlantUML (`User`, `QRCode`, `QRScanEvent`, `ShortUrl`, `ShortUrlClickEvent`, `Role`, `DestinationType`). |
| **Diagrama de Secuencia UML** | [`docs/qredirect_secuencia.puml`](./docs/qredirect_secuencia.puml) | Flujo completo de autenticación JWT, creación de QR, redirección pública atómica con cifrado Fernet y consulta de analíticas. |
| **Colección de Postman** | [`docs/QRedirect.postman_collection.json`](./docs/QRedirect.postman_collection.json) | Colección Postman v2.1 con **todos los endpoints**, variables precargadas y scripts de test (`pm.test`) que guardan automáticamente tokens JWT, IDs y slugs. |
| **Frontend README** | [`frontend/README.md`](./frontend/README.md) | Documentación específica del cliente SPA (React + TypeScript + Vite). |

---

## 2. Características Principales

### Códigos QR Dinámicos
- **Redirección dinámica (`/q/<slug>/`)**: Permite cambiar el destino cuantas veces sea necesario sin alterar la imagen impresa del QR.
- **6 tipos de destino soportados**:
  - `WEB`: Sitios web (`https://...` con normalización y validación de esquema).
  - `WHATSAPP`: Enlace directo a chat (`https://wa.me/<numero>`).
  - `EMAIL`: Enlace de correo (`mailto:<direccion>`).
  - `PHONE`: Llamada telefónica (`tel:<numero>`).
  - `MAP`: Búsqueda de ubicación o coordenadas en Google Maps.
  - `TEXT`: Visualización directa de texto plano UTF-8.
- **Personalización visual**: Selección de estilo de puntos (`square`, `dots`, `rounded`, `classy`, `extra-rounded`), estilo de esquinas, colores de contraste hexadecimales, incorporación de logo central en Base64 (hasta 500 KB) y descarga en formato **PNG** de alta resolución.
- **Slugs amigables o automáticos**: El usuario puede elegir un alias personalizado (ej. `/q/mi-menu/`, convirtiendo espacios en guiones automáticamente) o dejar que el sistema genere un código criptográficamente aleatorio único.

### Acortador de URLs
- **Rutas cortas (`/s/<slug>/`)**: Acorta enlaces largos con validación estricta de URL y normalización `https://`.
- **Control de estado (`is_active`)**: Interruptor inmediato para activar o pausar tanto códigos QR como URLs cortas desde el panel de control.

### Analíticas y Panel de Administración
- **Métricas en tiempo real**: Contadores atómicos de escaneos (`total_scans`) y clics (`total_clicks`).
- **Desglose de eventos**: Fecha y hora, país y ciudad, tipo de dispositivo (`Móvil`, `Tablet`, `Escritorio`), sistema operativo (`Android`, `iOS`, `Windows`, `macOS`, `Linux`) y navegador (`Chrome`, `Safari`, `Firefox`, `Edge`, `Opera`).
- **Control de acceso por roles (RBAC)**:
  - `USER`: Gestiona y visualiza únicamente sus propios códigos QR, enlaces cortos y analíticas.
  - `ADMIN`: Visualiza y administra la totalidad de los recursos y usuarios de la plataforma.

---

## 3. Stack Tecnológico

### Backend
- **Lenguaje y Framework**: Python 3.12+ · Django 6.0.3 · Django REST Framework 3.17.1
- **Autenticación**: `djangorestframework-simplejwt` (JWT Access + Refresh con rotación y lista negra)
- **Seguridad y Criptografía**: `cryptography` (Fernet AES-128-CBC + HMAC-SHA256 para cifrado de PII en reposo)
- **Generación de QR**: `qrcode` + `Pillow`
- **Documentación de API**: `drf-spectacular` (OpenAPI 3.0 + Swagger UI)
- **Base de Datos y Servidor**: PostgreSQL (`psycopg2-binary`, `dj-database-url`) / SQLite3 en desarrollo · `gunicorn` · `whitenoise`

### Frontend
- **Framework y Lenguaje**: React 19 · TypeScript 6 · Vite 8
- **Enrutado**: React Router DOM v7
- **Renderizado de QR**: `qr-code-styling`
- **Estilos e Iconografía**: Bootstrap 5.3 · Bootstrap Icons · CSS Custom
- **Calidad y Testing**: Vitest · Testing Library · Oxlint

---

## 4. Arquitectura y Estructura del Proyecto

```text
QRedirect/
├── QRedirect/                  # Configuración global del proyecto Django
│   ├── settings.py             # Configuración de DRF, JWT, CORS, Throttling y Seguridad HTTPS
│   ├── urls.py                 # Enrutador raíz (/api/, /q/<slug>/, /s/<slug>/, /api/docs/)
│   └── wsgi.py / asgi.py
├── users/                      # App de Identidad, Autenticación y Permisos RBAC
│   ├── models.py               # Modelo User personalizado (AbstractUser + Role ADMIN/USER)
│   ├── serializers.py          # UserSerializer y UserCreateSerializer (validate_password, email único)
│   ├── permissions.py          # Permisos IsAdmin e IsOwnerOrAdmin
│   ├── views.py                # UserViewSet, perfil (/api/profile/), LogoutView y vistas JWT con throttle
│   ├── urls.py                 # Rutas de usuarios y autenticación
│   └── tests.py                # Tests de autenticación, logout y seguridad contra escalada de roles
├── core/                       # App principal de Códigos QR, Short URLs y Analíticas
│   ├── fields.py               # EncryptedTextField (cifrado Fernet transparente en reposo)
│   ├── throttles.py            # AuthRateThrottle, RegisterRateThrottle y RedirectRateThrottle
│   ├── qr_utils.py             # Resolución de destinos y generación de imágenes PNG
│   ├── utils.py                # Generador de slugs únicos con módulo secrets
│   ├── views.py                # Vistas públicas de redirección (/q/, /s/), tracking atómico y /api/health/
│   ├── models/                 # Modelos QRCode, QRScanEvent, ShortUrl y ShortUrlClickEvent
│   ├── serializers/            # Validación de slugs, URLs, colores hex, logos Base64 y analíticas
│   ├── viewsets/               # QRCodeViewSet y ShortUrlViewSet (CRUD + /image/ + /analytics/)
│   └── tests.py                # Suite de pruebas unitarias y de integración (38+ tests)
├── frontend/                   # Aplicación SPA (React + TypeScript + Vite)
│   ├── src/
│   │   ├── api/                # Cliente HTTP con auto-refresh JWT, endpoints de auth, QR y ShortUrl
│   │   ├── components/         # Navbar, Hero, HowItWorks, Footer, ProtectedRoute, QrPreview
│   │   ├── context/            # AuthContext y AuthProvider (manejo de sesión)
│   │   ├── views/              # Home, Login, Register, CreateQr, ShortenUrl, MyLinks, Features
│   │   └── utils/              # Normalización de slugs y utilidades visuales
│   └── vercel.json             # Reglas de rewrite SPA para despliegue en Vercel
├── docs/                       # Documentación técnica y artefactos de prueba
│   ├── README.md               # Guía de uso de diagramas y Postman
│   ├── qredirect.puml          # Diagrama de Clases UML
│   ├── qredirect_secuencia.puml# Diagrama de Secuencia UML
│   └── QRedirect.postman_collection.json
├── Procfile                    # Comando de arranque para Railway / Render
├── railway.json                # Configuración de build y deploy en Railway
├── requirements.txt            # Dependencias de Python
└── manage.py
```

---

## 5. Modelo de Datos

El dominio se compone de 5 entidades principales (ver diagrama completo en [`docs/qredirect.puml`](./docs/qredirect.puml)):

```text
User (ADMIN | USER)
 ├── 1:N ──> QRCode (WEB | EMAIL | PHONE | WHATSAPP | MAP | TEXT)
 │             └── 1:N ──> QRScanEvent (ip_address y user_agent cifrados con Fernet)
 │
 └── 1:N ──> ShortUrl
               └── 1:N ──> ShortUrlClickEvent (ip_address y user_agent cifrados con Fernet)
```

---

## 6. Seguridad y Ciberseguridad

- **Protección contra Escalada de Privilegios**: El campo `role` es estrictamente de solo lectura en `UserSerializer` y se fuerza a `User.Role.USER` durante el registro público en `UserCreateSerializer`.
- **Autenticación JWT con Rotación y Blacklist**:
  - `ACCESS_TOKEN_LIFETIME`: 30 minutos · `REFRESH_TOKEN_LIFETIME`: 1 día.
  - `ROTATE_REFRESH_TOKENS = True` y `BLACKLIST_AFTER_ROTATION = True`: cada renovación invalida el refresh token anterior; el cierre de sesión (`POST /api/logout/`) revoca inmediatamente el token en base de datos.
- **Cifrado en Reposo (Fernet)**: Las direcciones IP (`ip_address`) y cabeceras `user_agent` de quienes escanean un QR o abren un link corto se almacenan cifradas en la base de datos mediante `EncryptedTextField` y nunca se exponen en los endpoints de analíticas.
- **Rate Limiting (Throttling por IP y Usuario)**:
  - Login y Refresh (`/api/token/`): `10/minuto` (`AuthRateThrottle`).
  - Registro de cuentas (`POST /api/users/`): `20/hora` (`RegisterRateThrottle`).
  - Redirecciones públicas (`/q/` y `/s/`): `120/minuto` (`RedirectRateThrottle`).
  - Peticiones generales: `200/hora` (anónimo) y `2000/hora` (autenticado).
- **Validación de Entradas**:
  - Ejecución de todos los validadores de `AUTH_PASSWORD_VALIDATORS` de Django en el registro.
  - Validación de colores hexadecimales (`#RGB` / `#RRGGBB`) y restricción de logos en Base64 a `image/(png|jpeg|jpg|webp)` (bloqueando SVG con scripts y URLs externas).
- **Integridad Concurrency-Safe**: Los contadores `total_scans` y `total_clicks` se actualizan mediante expresiones atómicas `F() + 1` dentro de `transaction.atomic()`.
- **Hardening en Producción (`DJANGO_DEBUG=False`)**: Activación automática de `SECURE_PROXY_SSL_HEADER`, `SECURE_SSL_REDIRECT`, `SESSION_COOKIE_SECURE`, `CSRF_COOKIE_SECURE`, `SECURE_HSTS_SECONDS` y `SECURE_CONTENT_TYPE_NOSNIFF`.

---

## 7. Endpoints de la API

Podés explorar la documentación interactiva en `http://localhost:8000/api/docs/` o importar directamente [`docs/QRedirect.postman_collection.json`](./docs/QRedirect.postman_collection.json) en Postman.

| Método | Ruta | Autenticación | Descripción |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health/` | Pública | Health check del servicio API |
| `GET` | `/api/schema/` | Pública | Esquema OpenAPI 3.0 |
| `GET` | `/api/docs/` | Pública | Documentación interactiva Swagger UI |
| `POST` | `/api/users/` | Pública (Throttled) | Registro de nuevo usuario (`role = USER`) |
| `POST` | `/api/token/` | Pública (Throttled) | Inicio de sesión (devuelve `access` y `refresh`) |
| `POST` | `/api/token/refresh/` | Pública (Throttled) | Renueva `access` y rota `refresh` |
| `POST` | `/api/logout/` | Bearer JWT | Invalida el `refresh` token en la lista negra |
| `GET / PATCH` | `/api/profile/` | Bearer JWT | Consulta o actualiza el perfil del usuario autenticado |
| `GET` | `/api/users/` | Bearer JWT (`ADMIN`) | Lista todos los usuarios registrados |
| `GET / POST` | `/api/qr/` | Bearer JWT | Lista (con `?search=` y `?ordering=`) o crea un código QR |
| `GET / PATCH / PUT / DELETE` | `/api/qr/{id}/` | Bearer JWT (Dueño/Admin) | Detalle, edición o eliminación de un QR |
| `GET` | `/api/qr/{id}/image/` | Bearer JWT (Dueño/Admin) | Genera y descarga el archivo PNG del QR |
| `GET` | `/api/qr/{id}/analytics/` | Bearer JWT (Dueño/Admin) | Total de escaneos y últimos 100 eventos anonimizados |
| `GET / POST` | `/api/shorturl/` | Bearer JWT | Lista (con `?search=` y `?ordering=`) o crea una URL corta |
| `GET / PATCH / PUT / DELETE` | `/api/shorturl/{id}/` | Bearer JWT (Dueño/Admin) | Detalle, edición o eliminación de una URL corta |
| `GET` | `/api/shorturl/{id}/analytics/` | Bearer JWT (Dueño/Admin) | Total de clics y últimos 100 eventos anonimizados |
| `GET` | `/q/{slug}/` | Pública (Throttled) | Registra el escaneo y redirige al destino del QR (302 / 200 texto) |
| `GET` | `/s/{slug}/` | Pública (Throttled) | Registra el clic y redirige a la URL original (302) |

---

## 8. Instalación y Ejecución en Local

### Requisitos previos
- **Python** 3.12+
- **Node.js** 20+ y `npm`

### Paso 1: Configurar y levantar el Backend (Puerto `8000`)

```bash
# 1. Crear y activar el entorno virtual
python3 -m venv .venv
source .venv/bin/activate

# 2. Instalar dependencias
pip install -r requirements.txt

# 3. Crear archivo de variables de entorno local
cp .env.example .env

# 4. Aplicar migraciones de base de datos
python manage.py migrate

# 5. Iniciar el servidor de desarrollo
python manage.py runserver 8000
```

### Paso 2: Configurar y levantar el Frontend (Puerto `3000`)

En otra terminal:

```bash
cd frontend

# 1. Instalar dependencias Node
npm install

# 2. Crear archivo de variables de entorno (opcional, por defecto usa http://localhost:8000)
cp .env.example .env

# 3. Levantar el servidor de desarrollo Vite
npm run dev
```

La aplicación estará disponible en **`http://localhost:3000`** y la API en **`http://localhost:8000`**.

---

## 9. Ejecución de Tests y Linter

### Backend (Django Test Runner)
```bash
source .venv/bin/activate
python manage.py check
python manage.py test
```

### Frontend (Vitest + Oxlint + Build)
```bash
cd frontend
npm run lint
npm test
npm run build
```

---

## 10. Despliegue en Producción (Railway + Vercel)

### Backend en Railway
El repositorio incluye [`Procfile`](./Procfile) y [`railway.json`](./railway.json) preconfigurados para ejecutar `collectstatic`, correr migraciones (`python manage.py migrate`) e iniciar Gunicorn en `0.0.0.0:$PORT`.

Variables de entorno requeridas en Railway:
- `DATABASE_URL`: Inyectada automáticamente al vincular un servicio **PostgreSQL** en Railway.
- `DJANGO_DEBUG`: `False`
- `DJANGO_SECRET_KEY`: Clave aleatoria larga (50+ caracteres).
- `DJANGO_ALLOWED_HOSTS`: Dominio asignado por Railway (ej. `mi-backend.up.railway.app`).
- `CORS_ALLOWED_ORIGINS`: URL pública del frontend en Vercel (ej. `https://mi-frontend.vercel.app`).
- `FIELD_ENCRYPTION_KEY`: *(Opcional)* Clave Fernet generada con `python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"`.

### Frontend en Vercel
El directorio [`frontend/`](./frontend) incluye [`frontend/vercel.json`](./frontend/vercel.json) para manejar el enrutado SPA de React Router.

Configuración en Vercel:
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Variable de entorno**:
  - `VITE_API_BASE_URL`: URL pública del backend en Railway (ej. `https://mi-backend.up.railway.app`, sin barra final).
