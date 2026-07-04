const { BlobServiceClient } = require('@azure/storage-blob');
const path = require('path');

const uploadBufferToBlob = async (buffer, originalName, mimetype) => {
  const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
  const CONTAINER_NAME = process.env.AZURE_STORAGE_CONTAINER_NAME || 'giftly-media';

  if (!AZURE_STORAGE_CONNECTION_STRING || AZURE_STORAGE_CONNECTION_STRING === 'DefaultEndpointsProtocol=https;AccountName=tu_cuenta;AccountKey=tu_key;EndpointSuffix=core.windows.net') {
    throw new Error("Azure Storage Connection String no está configurado correctamente en tu archivo .env");
  }

  const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
  const containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);

  // Crear el contenedor si no existe y habilitar acceso público de lectura a los blobs
  await containerClient.createIfNotExists({ access: 'blob' });

  // Generar un nombre único para evitar colisiones
  const extension = path.extname(originalName) || '';
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
  const blobName = `${uniqueSuffix}${extension}`;
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  // Subir el buffer
  await blockBlobClient.uploadData(buffer, {
    blobHTTPHeaders: { blobContentType: mimetype }
  });

  return blockBlobClient.url;
};

module.exports = {
  uploadBufferToBlob
};
