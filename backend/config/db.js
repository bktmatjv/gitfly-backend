const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI;

        if (!uri) {
            console.error('❌ MONGO_URI no está definida en las variables de entorno.');
            process.exit(1);
        }

        await mongoose.connect(uri);
        console.log('✅ MongoDB Conectado exitosamente.');

    } catch (error) {
        console.error('❌ Error al conectar con MongoDB:', error.message);
        process.exit(1); // Falla rápido → Docker reiniciará el contenedor
    }
};

module.exports = connectDB;
