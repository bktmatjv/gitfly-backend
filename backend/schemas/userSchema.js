const { z } = require('zod');

const createUserSchema = z.object({
  codigo_alumno: z.string().optional(),
  cuenta: z.object({
    email: z.string().email('Debe ser un correo electrónico válido'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
    username: z.string().min(3, 'El username debe tener al menos 3 caracteres')
  }),
  perfil: z.object({
    nombres: z.string().optional(),
    apellidos: z.string().optional(),
    biografia: z.string().optional(),
    avatar_url: z.string().url('Debe ser una URL válida').optional().or(z.literal(''))
  }).optional()
});

const updateUserSchema = z.object({
  codigo_alumno: z.string().optional(),
  cuenta: z.object({
    email: z.string().email('Debe ser un correo electrónico válido').optional(),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres').optional(),
    username: z.string().min(3, 'El username debe tener al menos 3 caracteres').optional()
  }).partial().optional(),
  perfil: z.object({
    nombres: z.string().optional(),
    apellidos: z.string().optional(),
    biografia: z.string().optional(),
    avatar_url: z.string().url('Debe ser una URL válida').optional().or(z.literal(''))
  }).partial().optional()
});

module.exports = {
  createUserSchema,
  updateUserSchema
};
