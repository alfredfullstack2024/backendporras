const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      autoIndex: process.env.NODE_ENV === "development", // Índices automáticos solo en dev
      serverSelectionTimeoutMS: 5000, // Tiempo máximo para seleccionar servidor
      maxPoolSize: 10, // Tamaño máximo del pool de conexiones
    });
    console.log(`MongoDB conectado: ${conn.connection.host} - DB: ${conn.connection.name}`);

    // Manejo de eventos
    mongoose.connection.on("disconnected", () => console.log("MongoDB desconectado"));
    mongoose.connection.on("error", (err) => console.error("Error de conexión:", err));
  } catch (error) {
    console.error("Error al conectar a MongoDB:", error.message);
    process.exit(1);
  }
};

module.exports = { connectDB, mongoose }; // Exportar ambos para usar en modelos si es necesario
