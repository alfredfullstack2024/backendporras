require("dotenv").config();
console.log("Variables de entorno cargadas:", process.env.MONGODB_URI);

const express = require("express");
const cors = require("cors");
const { connectDB } = require("./config/db");
const { protect } = require("./middleware/authMiddleware");

// Función para depurar rutas
const debugRoutes = (prefix, router) => {
  console.log(`🔍 Depurando rutas para prefijo: ${prefix}`);
  if (router && router.stack) {
    router.stack.forEach((layer, index) => {
      if (layer.route) {
        console.log(`Ruta ${index + 1}: ${prefix}${layer.route.path}`);
      }
    });
  }
};

// Validar variables de entorno
if (!process.env.MONGODB_URI) {
  console.error(
    "❌ Error: La variable de entorno MONGODB_URI no está definida. Verifica tu archivo .env"
  );
  process.exit(1);
}
if (!process.env.JWT_SECRET) {
  console.error(
    "❌ Error: La variable de entorno JWT_SECRET no está definida. Verifica tu archivo .env"
  );
  process.exit(1);
}

const app = express();

// Middleware
app.use(cors({ origin: "http://localhost:3000" })); // Permitir solicitudes desde el frontend en 3000
app.use(express.json());

// Middleware para registrar solicitudes entrantes
app.use((req, res, next) => {
  console.log(`📩 Solicitud recibida: ${req.method} ${req.url}`);
  next();
});

// Importar y registrar modelos
require("./models/User");
require("./models/Contabilidad");
require("./models/Entrenador");
require("./models/Cliente");
require("./models/RegistroClases");
require("./models/ComposicionCorporal");

// Conectar a MongoDB
console.log("Iniciando conexión a MongoDB...");
connectDB();

// Importar rutas
console.log("Configurando rutas...");
const clienteRoutes = require("./routes/clienteRoutes");
const membresiaRoutes = require("./routes/membresiaRoutes");
const entrenadorRoutes = require("./routes/entrenadorRoutes");
const productRoutes = require("./routes/productRoutes");
const pagoRoutes = require("./routes/pagoRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const claseRoutes = require("./routes/claseRoutes");
const contabilidadRoutes = require("./routes/contabilidad");
const indicadorRoutes = require("./routes/indicadorRoutes");
const asistenciaRoutes = require("./routes/asistenciaRoutes");
const rutinaRoutes = require("./routes/rutinas");
const composicionCorporalRoutes = require("./routes/composicionCorporal");

// Middleware para rutas públicas y protegidas
app.use((req, res, next) => {
  // Excluir la ruta pública de composición corporal
  if (req.path.startsWith("/api/composicion-corporal/cliente/")) {
    return next(); // No aplicar protect
  }
  // Excluir rutas de autenticación
  if (req.path.startsWith("/api/auth")) {
    return next(); // No aplicar protect
  }
  // Aplicar protect a todas las demás rutas
  protect(req, res, next);
});

// Rutas con depuración
console.log("Registrando rutas con depuración...");
debugRoutes("/api/clientes", clienteRoutes);
app.use("/api/clientes", clienteRoutes);
debugRoutes("/api/membresias", membresiaRoutes);
app.use("/api/membresias", membresiaRoutes);
debugRoutes("/api/entrenadores", entrenadorRoutes);
app.use("/api/entrenadores", entrenadorRoutes);
debugRoutes("/api/productos", productRoutes);
app.use("/api/productos", productRoutes);
debugRoutes("/api/pagos", pagoRoutes);
app.use("/api/pagos", pagoRoutes);
debugRoutes("/api/auth", authRoutes);
app.use("/api/auth", authRoutes);
debugRoutes("/api/users", userRoutes);
app.use("/api/users", userRoutes);
debugRoutes("/api/clases", claseRoutes);
app.use("/api/clases", claseRoutes);
debugRoutes("/api/contabilidad", contabilidadRoutes);
app.use("/api/contabilidad", contabilidadRoutes);
debugRoutes("/api/indicadores", indicadorRoutes);
app.use("/api/indicadores", indicadorRoutes);
debugRoutes("/api/asistencias", asistenciaRoutes);
app.use("/api/asistencias", asistenciaRoutes);
debugRoutes("/api/rutinas", rutinaRoutes);
app.use("/api/rutinas", rutinaRoutes);
debugRoutes("/api/composicion-corporal", composicionCorporalRoutes);
app.use("/api/composicion-corporal", composicionCorporalRoutes);

// Ruta raíz
app.get("/", (req, res) => {
  res.json({
    mensaje: "¡Servidor de Admin-Gimnasios funcionando correctamente!",
  });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  if (req.url.startsWith("/api")) {
    console.log(`⚠️ Ruta no encontrada: ${req.method} ${req.url}`);
    res
      .status(404)
      .json({ mensaje: `Ruta no encontrada: ${req.method} ${req.url}` });
  }
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error("❌ Error en el servidor:", err.stack);
  res.status(500).json({
    mensaje: "Error interno del servidor",
    error: err.message || "Error desconocido",
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});
