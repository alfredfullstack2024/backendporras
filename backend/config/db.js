const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error(
        "La variable de entorno MONGODB_URI no está definida. Verifica tu archivo .env."
      );
    }
    console.log(
      "Intentando conectar a MongoDB Atlas:",
      process.env.MONGODB_URI
    );
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Conectado: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error en la conexión a MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = { connectDB, mongoose };
