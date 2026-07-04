exports.errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;
  let detalles = null;

  // Manejo de errores específicos de Mongoose / MongoDB
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Formato de ID inválido: no se encontró un recurso con el id ${err.value}`;
  } else if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Error de validación de datos';
    detalles = Object.values(err.errors).map(val => val.message);
  } else if (err.code === 11000) {
    statusCode = 400;
    message = 'Valor duplicado detectado para un campo único';
    detalles = err.keyValue;
  }

  res.status(statusCode).json({
    message,
    detalles,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
};
