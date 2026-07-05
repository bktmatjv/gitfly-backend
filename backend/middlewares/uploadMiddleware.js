const multer = require('multer');

// Usamos memoryStorage para no guardar el archivo en el disco del contenedor
const storage = multer.memoryStorage();

// Filtro para aceptar imágenes y videos
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error('El archivo debe ser una imagen o video válido.'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 20 * 1024 * 1024 // Límite global de 20 MB (se valida específicamente en el controlador)
  },
  fileFilter: fileFilter
});

module.exports = upload;
