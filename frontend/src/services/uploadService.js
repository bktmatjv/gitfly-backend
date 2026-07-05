import apiClient from './apiClient';

/**
 * Sube un archivo multimedia al servidor (Azure Blob Storage)
 * @param {File} file - El objeto File a subir (imagen o video)
 * @returns {Promise<string>} La URL pública del archivo subido
 */
export const uploadMediaFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await apiClient.post('/uploads/media', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.url;
  } catch (error) {
    throw error;
  }
};
