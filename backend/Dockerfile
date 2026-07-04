# ─────────────────────────────────────────────
# Stage 1: development (con nodemon)
# ─────────────────────────────────────────────
FROM node:24-alpine AS dev

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000
CMD ["npm", "run", "dev"]

# ─────────────────────────────────────────────
# Stage 2: production (node puro, sin devDeps)
# ─────────────────────────────────────────────
FROM node:24-alpine AS prod

# Crear usuario no-root por seguridad
RUN addgroup -S giftly && adduser -S giftly -G giftly

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY . .

# Cambiar ownership al usuario no-root
RUN chown -R giftly:giftly /app

USER giftly

EXPOSE 3000
CMD ["node", "app.js"]
