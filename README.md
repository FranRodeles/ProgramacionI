# Proyecto: Plataforma web de gestión de códigos QR dinámicos y URLs cortas

## Descripción

Este proyecto consiste en una aplicación web que permite a los usuarios registrarse, iniciar sesión y crear códigos QR dinámicos asociados a distintos tipos de destino, como páginas web, correos electrónicos, teléfonos, WhatsApp o ubicaciones.

El sistema también permite generar URLs cortas y registrar estadísticas de uso, como cantidad de escaneos, fecha, dispositivo y otros datos relevantes.

La idea principal es que el QR no apunte directamente al destino final, sino a una ruta interna del sistema. De esta manera, se puede:

- contar escaneos,
- modificar el destino después de crear el QR,
- mostrar estadísticas en un panel,
- reutilizar el mismo QR sin volver a imprimirlo.

---

# Objetivos del proyecto

## Objetivo general

Desarrollar una plataforma web que permita generar, administrar y analizar códigos QR dinámicos y enlaces cortos.

## Objetivos específicos

- Implementar registro e inicio de sesión de usuarios.
- Permitir la creación y administración de códigos QR.
- Permitir la generación de URLs cortas.
- Registrar eventos de escaneo/click.
- Mostrar estadísticas en un dashboard.
- Permitir diferentes tipos de destino para un QR.

---

# Alcance del sistema

## Funcionalidades principales

- Registro de usuario
- Inicio de sesión
- Cierre de sesión
- Crear QR
- Editar QR
- Eliminar QR
- Ver listado de QRs creados
- Descargar QR como imagen
- Crear URL corta
- Redirigir según el tipo de destino
- Registrar escaneos y clics
- Mostrar estadísticas por QR
- Dashboard general del usuario

## Tipos de destino posibles

- Sitio web (`https://...`)
- Email (`mailto:...`)
- Teléfono (`tel:...`)
- WhatsApp
- Ubicación en mapa
- Texto simple

---

# Modelo de datos

## Entidades principales

### 1. User

Representa al usuario registrado en el sistema.

**Atributos sugeridos:**
- id
- name
- email
- password_hash
- created_at
- updated_at

---

### 2. QRCode

Representa un código QR creado por un usuario.

**Atributos sugeridos:**
- id
- user_id
- name
- slug
- destination_type
- destination_value
- is_active
- qr_image_path
- total_scans
- created_at
- updated_at

**Notas:**
- `slug` será el identificador único en la URL, por ejemplo: `misitio.com/q/abc123`
- `destination_type` define el tipo de destino:
  - WEB
  - EMAIL
  - PHONE
  - WHATSAPP
  - MAP
  - TEXT

- `destination_value` guarda el contenido real del destino.
  - Si es web: una URL
  - Si es email: un mail o una estructura más completa
  - Si es teléfono: un número
  - etc.

---

### 3. QRScanEvent

Representa cada vez que un QR fue escaneado.

**Atributos sugeridos:**
- id
- qr_code_id
- scanned_at
- ip_address
- country
- city
- device_type
- os
- browser
- user_agent

**Notas:**
Esta tabla sirve para estadísticas.  
Cada escaneo genera un nuevo registro.

---

### 4. ShortUrl

Representa una URL corta creada por el usuario.

**Atributos sugeridos:**
- id
- user_id
- name
- slug
- original_url
- total_clicks
- is_active
- created_at
- updated_at

---

### 5. ShortUrlClickEvent

Representa cada clic sobre una URL corta.

**Atributos sugeridos:**
- id
- short_url_id
- clicked_at
- ip_address
- country
- city
- device_type
- os
- browser
- user_agent

---

# Relaciones entre entidades

## Relación conceptual

- Un **User** puede tener muchos **QRCode**
- Un **User** puede tener muchas **ShortUrl**
- Un **QRCode** puede tener muchos **QRScanEvent**
- Una **ShortUrl** puede tener muchos **ShortUrlClickEvent**

---

# Diagrama simple de relaciones

```text
User
 ├── 1:N ── QRCode
 │            └── 1:N ── QRScanEvent
 │
 └── 1:N ── ShortUrl
              └── 1:N ── ShortUrlClickEvent
