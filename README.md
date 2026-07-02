# Giftly API (Backend)

Capa de aplicación (API REST) para la red social Giftly.
Implementado con Node.js, Express y MongoDB usando arquitectura de micro-enrutamiento.

## Estructura
- `/models`: Esquemas de base de datos (Mongoose)
- `/controllers`: Lógica de negocio (CRUD, paginación, auth)
- `/routes`: Endpoints RESTful
- `/middlewares`: Filtros de seguridad JWT y manejo de errores globales

## Ejecución Local (Desarrollo)
1. Instalar dependencias: `npm install`
2. Configurar archivo `.env`
3. Levantar servidor con auto-recarga: `npm run dev`

## Despliegue en Producción (Docker)
Este repositorio está preparado para Integración Continua. Al hacer push a la rama `main`, GitHub Actions se encargará de reconstruir la imagen Docker en la VM de Azure.

Para correrlo manualmente:
```bash
docker-compose up -d --build
```
