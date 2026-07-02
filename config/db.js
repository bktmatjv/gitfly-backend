const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        if (process.env.MONGO_URI) {
            // Intenta conectar. Agregamos un timeout corto por si no hay un MongoDB local corriendo.
            await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 3000 });
            console.log('✅ MongoDB Conectado (Entorno de Prueba Local)');
        }
    } catch (error) {
        console.warn('⚠️ No se pudo conectar a MongoDB local (probablemente no lo tienes instalado). Las rutas seguirán funcionando en modo simulación. Error:', error.message);
        // No matamos el proceso para que puedas probar las rutas de app.js
    }
};

module.exports = connectDB;
