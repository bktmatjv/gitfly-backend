const validateSchema = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (error) {
    return res.status(400).json({
      error: 'Error de validación de datos',
      detalles: error.errors.map(err => ({
        campo: err.path.join('.'),
        mensaje: err.message
      }))
    });
  }
};

module.exports = validateSchema;
