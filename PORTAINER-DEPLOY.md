# Guía de Despliegue en Portainer / VPS con Docker 🐳

Esta guía te explica paso a paso cómo desplegar la **Bitácora de Recuerdos** en tu VPS usando **Portainer**.

---

## Opción 1: Desplegar directamente desde GitHub en Portainer (Recomendado)

1. Abre tu panel de **Portainer** en el VPS.
2. Ve a **Stacks** en el menú lateral y haz clic en **+ Add stack**.
3. Ponle un nombre al Stack (por ejemplo, `bitacora-citas`).
4. En **Build method**, selecciona **Repository**.
5. Completa la configuración del repositorio:
   - **Repository URL**: `https://github.com/ElChel4s/MyN.git`
   - **Repository reference**: `refs/heads/docker-portainer` (o `refs/heads/main` si luego haces merge)
   - **Compose path**: `docker-compose.yml`
6. En la sección **Environment variables** (abajo), haz clic en **+ Add environment variable** y añade tus dos variables de Supabase:
   - `NEXT_PUBLIC_SUPABASE_URL`: Tu URL del proyecto de Supabase (ej: `https://xxxx.supabase.co`)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Tu clave anónima (anon public key) de Supabase
   - *(Opcional)* `HOST_PORT`: `3005` (o cualquier puerto libre en tu VPS como `3001`, `8080`, `4000`. Por defecto es `3005` para evitar conflictos con el 3000)
7. Haz clic en **Deploy the stack**.
   - Portainer clonará el repositorio, construirá la imagen optimizada con Alpine y levantará el contenedor automáticamente.
   - Podrás acceder desde tu navegador en `http://IP_DE_TU_VPS:3005` (o el puerto que hayas configurado).

---

## Opción 2: Desplegar usando Docker CLI directamente en el VPS

Si prefieres clonar por terminal en tu VPS:

```bash
# 1. Clonar el repositorio y pasarse a la rama docker
git clone https://github.com/ElChel4s/MyN.git
cd MyN
git checkout docker-portainer

# 2. Crear archivo .env con tus credenciales
nano .env
```

Contenido del `.env`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-clave-anonima-de-supabase
PORT=3000
```

```bash
# 3. Construir y levantar en segundo plano
docker compose up -d --build
```

---

## Notas Técnicas
- **Multi-Stage Build**: Usa Node 20 Alpine y el modo `output: 'standalone'` de Next.js, por lo que la imagen final pesa menos de 150 MB y consume muy poca memoria RAM en tu VPS.
- **Variables públicas de Next.js**: Se pasan como `ARG` y `ENV` durante el build en `docker-compose.yml` para que Next.js compile correctamente las llamadas al cliente de Supabase.
- **Reinicio automático**: Incluye `restart: unless-stopped` para que si se reinicia el VPS, el contenedor vuelva a levantarse solo.
