const { z } = require('zod');

const registerSchema = z.object({
  cuenta: z.object({
    email: z.string().email('Debe ser un correo válido'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
    username: z.string().min(3, 'El nombre de usuario debe tener al menos 3 caracteres')
  }),
  perfil: z.object({
    nombres: z.string().optional(),
    apellidos: z.string().optional(),
    biografia: z.string().optional(),
    edad: z.number().optional(),
    avatar_url: z.string().url('Debe ser una URL válida').optional()
  }).optional()
});

const loginSchema = z.object({
  email: z.string().email('Debe ser un correo válido'),
  password: z.string().min(1, 'La contraseña es obligatoria')
});

module.exports = {
  registerSchema,
  loginSchema
};
