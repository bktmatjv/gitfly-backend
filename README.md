# Giftly — Arquitectura de 3 Capas Dockerizada

Red social para creación y gestión colaborativa de listas de deseos.

## Arquitectura

```
Internet → [Nginx :80] → /        → Frontend React (estático)
                       → /api/*   → Backend Node.js → MongoDB (red interna)
```

| Servicio | Imagen | Puerto expuesto |
|---|---|---|
| `nginx` | `nginx:1.27-alpine` | 80, 443 |
| `backend` | `node:20-alpine` (custom) | — (solo interno) |
| `frontend` | `node:20-alpine` + `nginx:alpine` | — (sirve a través de nginx) |
| `mongo` | `mongo:7.0` | — (solo interno) |

## Requisitos

- Docker Engine 24+
- Docker Compose v2

## Setup inicial

### 1. Clonar y configurar variables de entorno

```bash
git clone <repo-url> giftly
cd giftly
cp .env.example .env
nano .env  # Edita las credenciales y secrets
```

**Variables obligatorias a cambiar en `.env`:**
- `MONGO_ROOT_PASSWORD` — contraseña segura de MongoDB
- `JWT_SECRET` — string largo y aleatorio (usa: `openssl rand -hex 32`)
- `CORS_ORIGIN` — tu dominio en producción

### 2. Crear el volumen de datos

```bash
mkdir -p volumes/mongodb
```

### 3. Construir y levantar

```bash
docker compose up -d --build
```

### 4. Verificar que todo esté corriendo

```bash
docker compose ps
curl http://localhost/api/health
```

---

## Comandos útiles

| Acción | Comando |
|---|---|
| Ver logs en tiempo real | `docker compose logs -f` |
| Ver logs de un servicio | `docker compose logs -f backend` |
| Reiniciar un servicio | `docker compose restart backend` |
| Parar todo | `docker compose down` |
| Parar y borrar volúmenes | `docker compose down -v` ⚠️ |
| Ejecutar backup | `./scripts/backup.sh` |
| Restaurar backup | `./scripts/restore.sh ./backups/archivo.gz` |
| Deploy actualización | `./scripts/deploy.sh` |

## Estructura del proyecto

```
giftly/
├── docker-compose.yml      # Orquestador principal
├── .env                    # Variables secretas (NO en git)
├── .env.example            # Template de variables
├── backend/                # API Node.js + Express
├── frontend/               # React + Vite (scaffold base)
├── nginx/                  # Reverse proxy config
├── mongodb/init/           # Script de inicialización de DB
├── volumes/mongodb/        # Datos persistentes (NO en git)
├── ssl/                    # Certificados SSL (cuando tengas dominio)
├── scripts/                # deploy.sh, backup.sh, restore.sh
└── backups/                # Backups de MongoDB (NO en git)
```

## SSL / HTTPS

Cuando tengas un dominio:
1. Obtén los certificados (Let's Encrypt con Certbot)
2. Colócalos en `ssl/fullchain.pem` y `ssl/privkey.pem`
3. Descomenta el bloque HTTPS en `nginx/conf.d/default.conf`
4. `docker compose restart nginx`

## Desarrollo local

Para desarrollar el frontend localmente (con hot reload):
```bash
cd frontend
npm install
npm run dev    # Corre en http://localhost:5173
```

Para el backend con nodemon:
```bash
# En docker-compose.yml, cambia target: prod → target: dev en el servicio backend
docker compose up backend mongo -d
```
