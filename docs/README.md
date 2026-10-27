# Documentación Técnica: Diagramas UML y Colección Postman — QRedirect

Esta carpeta contiene los diagramas UML y la colección de pruebas de API del proyecto **QRedirect**:

## 1. Diagramas PlantUML (`.puml`)

- **[`qredirect.puml`](./qredirect.puml)**: Diagrama de clases UML del dominio de **QRedirect** (`User`, `QRCode`, `QRScanEvent`, `ShortUrl`, `ShortUrlClickEvent` y las enumeraciones `Role` y `DestinationType`), con sus atributos, métodos, multiplicidades (`1` a `0..*`) y relaciones de asociación y composición.
- **[`qredirect_secuencia.puml`](./qredirect_secuencia.puml)**: Diagrama de secuencia del flujo completo de autenticación JWT, creación de QR dinámico, redirección pública atómica con cifrado Fernet y consulta de analíticas anonimizadas.

### Cómo visualizar los diagramas
- En **VS Code**: instalar la extensión *PlantUML* (`jebbs.plantuml`) y presionar `Alt + D` sobre cualquiera de los archivos `.puml`.
- Online: copiar el contenido en [https://www.plantuml.com/plantuml](https://www.plantuml.com/plantuml).

---

## 2. Colección de Postman (`QRedirect.postman_collection.json`)

El archivo **[`QRedirect.postman_collection.json`](./QRedirect.postman_collection.json)** incluye todos los endpoints del proyecto organizados en 6 carpetas secuenciales, con variables precargadas y scripts de test automáticos (`pm.test`).

### Variables de Colección Precargadas
| Variable | Valor por defecto | Descripción |
| :--- | :--- | :--- |
| `base_url` | `http://localhost:8000` | URL base del backend (cambiar por la URL de Railway para probar producción) |
| `username` | `demo_qredirect` | Usuario de prueba |
| `email` | `demo@qredirect.com` | Email de prueba |
| `password` | `QRedirect2026!Segura` | Contraseña válida para `AUTH_PASSWORD_VALIDATORS` |
| `access_token` | *(se autocompleta)* | Guardado automáticamente al ejecutar **Iniciar Sesión** o **Refrescar Token** |
| `refresh_token` | *(se autocompleta)* | Guardado automáticamente al ejecutar **Iniciar Sesión** o **Refrescar Token** |
| `user_id` | `1` *(se autocompleta)* | ID del usuario autenticado |
| `qr_id` | `1` *(se autocompleta)* | ID del último QR creado |
| `qr_slug` | `menu-cafeteria-demo` | Slug del QR para probar `/q/{{qr_slug}}/` |
| `shorturl_id` | `1` *(se autocompleta)* | ID de la última URL corta creada |
| `shorturl_slug` | `promo-invierno-demo` | Slug de la URL corta para probar `/s/{{shorturl_slug}}/` |

### Cómo importar y ejecutar en Postman
1. Abrir **Postman** -> clic en **Import** -> seleccionar `docs/QRedirect.postman_collection.json`.
2. Podés ejecutar toda la colección de punta a punta con **Run collection** (Collection Runner), o probar petición por petición siguiendo el orden de las carpetas (`01` a `06`).
