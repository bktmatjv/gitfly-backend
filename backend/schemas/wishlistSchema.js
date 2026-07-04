const { z } = require('zod');

const createWishlistSchema = z.object({
  evento: z.object({
    titulo: z.string().min(1, 'El título del evento es obligatorio'),
    categoria: z.string().optional(),
    descripcion: z.string().optional(),
    fecha_celebracion: z.coerce.date().optional()
  }),
  item_regalo: z.object({
    nombre: z.string().min(1, 'El nombre del regalo es obligatorio'),
    precio_estimado: z.number().positive('El precio estimado debe ser mayor a 0'),
    divisa: z.string().optional(),
    prioridad_deseo: z.enum(['Alta', 'Media', 'Baja']).optional(),
    tienda_sugerida: z.string().optional(),
    url_referencia: z.string().url('Debe ser una URL válida').optional().or(z.literal(''))
  }),
  recursos_multimedia: z.object({
    imagen_url: z.string().url().optional().or(z.literal('')),
    video_review_url: z.string().url().optional().or(z.literal(''))
  }).optional(),
  control_estado: z.object({
    permite_financiamiento: z.boolean().optional()
  }).optional()
});

const updateWishlistSchema = z.object({
  evento: z.object({
    titulo: z.string().min(1, 'El título del evento es obligatorio').optional(),
    categoria: z.string().optional(),
    descripcion: z.string().optional(),
    fecha_celebracion: z.coerce.date().optional()
  }).partial().optional(),
  item_regalo: z.object({
    nombre: z.string().min(1, 'El nombre del regalo es obligatorio').optional(),
    precio_estimado: z.number().positive('El precio estimado debe ser mayor a 0').optional(),
    divisa: z.string().optional(),
    prioridad_deseo: z.enum(['Alta', 'Media', 'Baja']).optional(),
    tienda_sugerida: z.string().optional(),
    url_referencia: z.string().url('Debe ser una URL válida').optional().or(z.literal(''))
  }).partial().optional(),
  recursos_multimedia: z.object({
    imagen_url: z.string().url().optional().or(z.literal('')),
    video_review_url: z.string().url().optional().or(z.literal(''))
  }).partial().optional(),
  control_estado: z.object({
    permite_financiamiento: z.boolean().optional()
  }).partial().optional()
});

module.exports = {
  createWishlistSchema,
  updateWishlistSchema
};
