const multer = require('multer');

// Usamos memoryStorage para no guardar el archivo en el disco del contenedor
const storage = multer.memoryStorage();

// Filtro para aceptar solo imágenes
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('El archivo debe ser una imagen (jpeg, png, webp, etc.)'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // Límite de 5 MB
  },
  fileFilter: fileFilter
});

module.exports = upload;
