const { uploadBufferToBlob } = require('../services/blobStorageService');

exports.uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400);
      throw new Error('No se envió ningún archivo');
    }

    // El archivo está en req.file.buffer gracias a multer.memoryStorage()
    const imageUrl = await uploadBufferToBlob(req.file.buffer, req.file.originalname, req.file.mimetype);

    res.status(200).json({
      message: 'Imagen subida exitosamente',
      url: imageUrl
    });
  } catch (error) {
    next(error);
  }
};
