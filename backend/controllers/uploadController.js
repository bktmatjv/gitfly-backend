const { uploadBufferToBlob } = require('../services/blobStorageService');

exports.uploadMedia = async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400);
      throw new Error('No se envió ningún archivo');
    }

    // Validar límites específicos
    const isImage = req.file.mimetype.startsWith('image/');
    const isVideo = req.file.mimetype.startsWith('video/');
    
    if (isImage && req.file.buffer.length > 5 * 1024 * 1024) {
      res.status(400);
      throw new Error('El tamaño de la imagen excede el límite permitido de 5 MB.');
    }
    
    if (isVideo && req.file.buffer.length > 20 * 1024 * 1024) {
      res.status(400);
      throw new Error('El tamaño del video excede el límite permitido de 20 MB.');
    }

    // El archivo está en req.file.buffer gracias a multer.memoryStorage()
    const mediaUrl = await uploadBufferToBlob(req.file.buffer, req.file.originalname, req.file.mimetype);

    res.status(200).json({
      message: 'Archivo subido exitosamente',
      url: mediaUrl
    });
  } catch (error) {
    next(error);
  }
};
