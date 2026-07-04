# ─────────────────────────────────────────────
# Stage 1: BUILD — compila React con Vite
# ─────────────────────────────────────────────
FROM node:24-alpine AS build

WORKDIR /app

# Instalar dependencias primero (aprovecha cache de Docker)
COPY package*.json ./
RUN npm ci

# Copiar código fuente y compilar
COPY . .
RUN npm run build

# ─────────────────────────────────────────────
# Stage 2: SERVE — Nginx sirve el build estático
# ─────────────────────────────────────────────
FROM nginx:1.27-alpine AS serve

# Copiar artefactos del build de Vite
COPY --from=build /app/dist /usr/share/nginx/html

# Copiar config de Nginx para SPA (maneja client-side routing)
COPY nginx-spa.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
