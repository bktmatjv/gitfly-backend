const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');

dotenv.config();

// ─── Validar variables de entorno críticas al arranque ───────────────
if (!process.env.JWT_SECRET) {
    console.error('❌ JWT_SECRET no está definida. Deteniéndose.');
    process.exit(1);
}

const app = express();

// ─── CORS ─────────────────────────────────────────────────────────────
const allowedOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map(o => o.trim())
    : [];

app.use(cors({
    origin: function (origin, callback) {
        // Permitir solicitudes sin origen (Postman, curl, Docker healthcheck)
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error('Origen no permitido por CORS'));
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// ─── Seguridad y middlewares ──────────────────────────────────────────
app.use(helmet());

// Rate Limiting (100 peticiones por IP cada 15 minutos)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Demasiadas peticiones desde esta IP, por favor intenta de nuevo en 15 minutos.'
});
app.use(limiter);

// Logging
if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined'));
}

app.use(express.json({ limit: '100kb' }));

// ─── Conexión DB ──────────────────────────────────────────────────────
connectDB();

// ─── Routes ───────────────────────────────────────────────────────────
const healtRoutes = require('./routes/healtRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const friendshipRoutes = require('./routes/friendshipRoutes');
const contributionRoutes = require('./routes/contributionRoutes');
const interactionRoutes = require('./routes/interactionRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

app.use('/api/health', healtRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/wishlists', wishlistRoutes);
app.use('/api/friendships', friendshipRoutes);
app.use('/api/contributions', contributionRoutes);
app.use('/api/interactions', interactionRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/uploads', uploadRoutes);

// Endpoint raíz
app.get('/', (req, res) => {
    res.json({ message: 'Giftly API Running', version: '2.0.0' });
});

// Manejo global de errores (siempre al final)
const { errorHandler } = require('./middlewares/errorHandler');
app.use(errorHandler);

// ─── Servidor ─────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
});

// ─── Graceful Shutdown (B-11) ─────────────────────────────────────────
// Cuando Docker hace "docker compose down", envía SIGTERM.
// Cerramos el servidor y la conexión a MongoDB limpiamente.
const shutdown = (signal) => {
    console.log(`\n⚠️  ${signal} recibido. Cerrando servidor...`);
    server.close(async () => {
        await mongoose.connection.close();
        console.log('✅ Conexión MongoDB cerrada. Servidor detenido.');
        process.exit(0);
    });
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT',  () => shutdown('SIGINT'));
