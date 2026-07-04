#!/bin/bash
# backup.sh — Crea un backup de la base de datos Giftly (MongoDB)
# Uso: ./scripts/backup.sh
set -e

BACKUP_DIR="./backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_NAME="giftly_backup_${TIMESTAMP}"

# Cargar variables de entorno
if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
fi

echo "💾 [Giftly Backup] Iniciando backup: ${BACKUP_NAME}"

# Crear directorio de backups si no existe
mkdir -p "${BACKUP_DIR}"

# Ejecutar mongodump dentro del contenedor y copiar al host
docker compose exec -T mongo mongodump \
    --username "${MONGO_ROOT_USER}" \
    --password "${MONGO_ROOT_PASSWORD}" \
    --authenticationDatabase admin \
    --db "${MONGO_DB_NAME}" \
    --archive \
    --gzip > "${BACKUP_DIR}/${BACKUP_NAME}.gz"

echo "✅ Backup guardado en: ${BACKUP_DIR}/${BACKUP_NAME}.gz"
echo "📦 Tamaño: $(du -sh "${BACKUP_DIR}/${BACKUP_NAME}.gz" | cut -f1)"

# Eliminar backups con más de 7 días
find "${BACKUP_DIR}" -name "*.gz" -mtime +7 -delete
echo "🧹 Backups anteriores a 7 días eliminados."
