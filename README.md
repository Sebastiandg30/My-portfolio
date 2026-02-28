# Sebastian Gomez Portfolio (Next.js)

Portfolio personal con enfoque en QA y logros reales. Incluye panel de administración en el frontend para editar la sección de achievements sin modificar código.

## Stack

- Next.js 15 (App Router)
- React + TypeScript
- Tailwind CSS
- Framer Motion

## Rutas principales

- `/` Portfolio público
- `/admin` Panel para crear/editar/eliminar/reordenar logros
- `/api/achievements` API de lectura/escritura de logros

## Desarrollo local

```bash
npm ci
npm run dev
```

## Variables de entorno

Crea `.env.local` con al menos:

```bash
ADMIN_PASSWORD=tu_password_segura
```

Compatibilidad heredada:

- Si `ADMIN_PASSWORD` no existe, la API usa `NEXT_PUBLIC_ADMIN_PASSWORD`.
- Si tampoco existe, usa `sgqa2024`.

## Persistencia de logros

### Modo local (por defecto)

Sin configuración extra, la API guarda en:

- `data/achievements.json`

Esto funciona bien en local, pero en Vercel no es persistente para escritura por filesystem.

### Modo recomendado para Vercel: GitHub storage

La API puede leer/escribir el archivo `data/achievements.json` directo en tu repo por GitHub API.

Configura en Vercel:

```bash
ACHIEVEMENTS_STORAGE=github
GITHUB_REPO=Sebastiandg30/My-portfolio
GITHUB_BRANCH=upwork-safe
GITHUB_ACHIEVEMENTS_PATH=data/achievements.json
GITHUB_TOKEN=ghp_xxx_con_permiso_repo
ADMIN_PASSWORD=tu_password_segura
```

Cada guardado desde `/admin` crea un commit en el repo y dispara deploy automático en Vercel.

## Notas

- El panel `/admin` no requiere tocar código para actualizar logros.
- La sección "Client Achievements" del homepage consume la API en tiempo real.
