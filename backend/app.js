const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');

dotenv.config();

const app = express();
const allowedOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(",")
    : [];

app.use(cors({
    origin: function (origin, callback) {
        // Permitir solicitudes sin origen (como Postman o curl locales)
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error("Origen no permitido por CORS"));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
const mongoUri = process.env.MONGO_URI;
const port = process.env.PORT || 3000;

// Middleware
app.use(helmet());

// Rate Limiting (100 peticiones por IP cada 15 minutos)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Demasiadas peticiones desde esta IP, por favor intenta de nuevo en 15 minutos.'
});
app.use(limiter);

// Logging de peticiones HTTP en desarrollo
if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'));
}

app.use(express.json({ limit: "100kb" }));
// Conexión DB
connectDB();

// Routes
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

// Endpoint Raíz
app.get('/', (req, res) => {
    res.send('Giftly API Running Correctly (Nivel 2)');
});

// Manejo Global de Errores (Siempre debe ir al final)
const { errorHandler } = require('./middlewares/errorHandler');
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
