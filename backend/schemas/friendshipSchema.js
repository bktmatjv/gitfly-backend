const { z } = require('zod');

// Nota: isValidObjectId de mongoose podría usarse también, pero una regex sirve para Zod.
const objectIdRegex = /^[0-9a-fA-F]{24}$/;

const createFriendshipSchema = z.object({
  receptor_id: z.string().regex(objectIdRegex, 'ID de usuario receptor inválido'),
  configuracion: z.object({
    nivel_prioridad: z.string().optional(),
    recibir_notificaciones: z.boolean().optional()
  }).optional()
});

const updateFriendshipSchema = z.object({
  auditoria_relacion: z.object({
    estado_vinculo: z.enum(['pendiente', 'aceptado', 'rechazado'])
  }).optional(),
  configuracion: z.object({
    nivel_prioridad: z.string().optional(),
    recibir_notificaciones: z.boolean().optional()
  }).optional()
});

module.exports = {
  createFriendshipSchema,
  updateFriendshipSchema
};
