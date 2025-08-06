const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      autoIndex: process.env.NODE_ENV === "development",
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`MongoDB conectado: ${conn.connection.host} - DB: ${conn.connection.name}`);
    mongoose.connection.on("disconnected", () => console.log("MongoDB desconectado"));
    mongoose.connection.on("error", (err) => console.error("Error de conexión:", err));
  } catch (error) {
    console.error("Error al conectar a MongoDB:", error.message);
    process.exit(1);
  }
};

module.exports = { connectDB, mongoose };
