# QRedirect — Frontend SPA (React + TypeScript + Vite)

Cliente web de **QRedirect** construido con **React 19**, **TypeScript**, **Vite 8**, **React Router v7**, **Bootstrap 5** y **`qr-code-styling`**.

Para ver la documentación general del proyecto, arquitectura del backend, diagramas UML y colección de Postman, consultá el [**README principal (`../README.md`)**](../README.md) y la carpeta [**`../docs/`**](../docs/README.md).

---

## Scripts Disponibles

Desde la carpeta `frontend/`:

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo en http://localhost:3000
npm run dev

# Ejecutar linter (Oxlint)
npm run lint

# Ejecutar tests unitarios e integración (Vitest + Testing Library)
npm test

# Compilar para producción en ./dist
npm run build
```

## Variables de Entorno

Copiá `.env.example` a `.env`:

```env
VITE_API_BASE_URL=http://localhost:8000
```

En producción (Vercel), configurá `VITE_API_BASE_URL` apuntando al dominio público del backend en Railway (sin `/` al final).
