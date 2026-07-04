#!/bin/bash
# deploy.sh — Despliega o actualiza Giftly en el servidor
# Uso: ./scripts/deploy.sh
set -e

echo "🚀 [Giftly Deploy] Iniciando despliegue..."

# 1. Obtener últimos cambios del repositorio
echo "📦 Actualizando código desde git..."
git pull origin main

# 2. Crear directorio de volumen de MongoDB si no existe
mkdir -p ./volumes/mongodb

# 3. Construir imágenes (sin cache para garantizar cambios frescos)
echo "🔨 Construyendo imágenes Docker..."
docker compose build --no-cache

# 4. Levantar todos los servicios en segundo plano
echo "⬆️  Levantando servicios..."
docker compose up -d

# 5. Esperar a que los servicios estén saludables
echo "⏳ Esperando health checks..."
sleep 10

# 6. Mostrar estado final
echo ""
echo "✅ Despliegue completado. Estado de los servicios:"
docker compose ps

echo ""
echo "📋 Logs recientes del backend:"
docker compose logs --tail=20 backend
