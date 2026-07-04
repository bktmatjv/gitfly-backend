#!/bin/bash
# restore.sh — Restaura la base de datos Giftly desde un backup
# Uso: ./scripts/restore.sh ./backups/giftly_backup_20260704_120000.gz
set -e

BACKUP_FILE="$1"

if [ -z "${BACKUP_FILE}" ]; then
    echo "❌ Error: debes especificar el archivo de backup."
    echo "   Uso: ./scripts/restore.sh ./backups/giftly_backup_YYYYMMDD_HHMMSS.gz"
    echo ""
    echo "   Backups disponibles:"
    ls -lh ./backups/*.gz 2>/dev/null || echo "   (ninguno encontrado)"
    exit 1
fi

if [ ! -f "${BACKUP_FILE}" ]; then
    echo "❌ Error: el archivo '${BACKUP_FILE}' no existe."
    exit 1
fi

# Cargar variables de entorno
if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
fi

echo "⚠️  ADVERTENCIA: Esta operación sobreescribirá la base de datos '${MONGO_DB_NAME}'."
read -p "   ¿Confirmas? (escribe 'SI' para continuar): " CONFIRM

if [ "${CONFIRM}" != "SI" ]; then
    echo "Operación cancelada."
    exit 0
fi

echo "🔄 [Giftly Restore] Restaurando desde: ${BACKUP_FILE}"

# Ejecutar mongorestore dentro del contenedor
cat "${BACKUP_FILE}" | docker compose exec -T mongo mongorestore \
    --username "${MONGO_ROOT_USER}" \
    --password "${MONGO_ROOT_PASSWORD}" \
    --authenticationDatabase admin \
    --db "${MONGO_DB_NAME}" \
    --archive \
    --gzip \
    --drop

echo "✅ Restauración completada exitosamente."
