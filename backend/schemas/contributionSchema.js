const { z } = require('zod');

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

const createContributionSchema = z.object({
  wishlist_id: z.string().regex(objectIdRegex, 'ID de wishlist inválido'),
  monto_aportado: z.number().positive('El monto aportado debe ser mayor a 0'),
  nombre_aportante: z.string().optional(),
  pasarela_pago: z.string().optional(),
  auditoria_pago: z.object({
    numero_operacion: z.string().optional()
  }).optional()
});

module.exports = {
  createContributionSchema
};
