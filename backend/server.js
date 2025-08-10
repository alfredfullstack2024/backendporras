require("dotenv").config();
console.log("Variables de entorno cargadas:", process.env.MONGODB_URI);

const express = require("express");
const cors = require("cors");
const { connectDB } = require("./config/db");
const { protect } = require("./middleware/authMiddleware");

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

const corsOptions = {
  origin: [
    "https://frontendporras-a8eks8q5d-alfredos-projects-a028b04c.vercel.app",
    /^https:\/\/frontendporras-.*\.vercel\.app$/,
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 200,
};

if (!process.env.MONGODB_URI) {
  console.error("❌ Error: MONGODB_URI no definida");
  process.exit(1);
}
if (!process.env.JWT_SECRET) {
  console.error("❌ Error: JWT_SECRET no definida");
  process.exit(1);
}

const app = express();

app.use(cors(corsOptions));
app.use(express.json());

app.use((req, res, next) => {
  console.log(`📩 Solicitud recibida: ${req.method} ${req.url} - ${new Date().toISOString()}`);
  next();
});

console.log("Cargando modelos...");
require("./models/User");
require("./models/Contabilidad");
require("./models/Entrenador");
require("./models/Cliente");
require("./models/RegistroClases");
require("./models/ComposicionCorporal");
console.log("Modelos cargados exitosamente");

console.log("Iniciando conexión a MongoDB...");
connectDB()
  .then(() => console.log("✅ Conexión a MongoDB establecida"))
  .catch((error) => {
    console.error("❌ Error al conectar a MongoDB:", error.message);
    process.exit(1);
  });

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

app.use((req, res, next) => {
  if (req.path.startsWith("/api/composicion-corporal/cliente/") || req.path.startsWith("/api/auth")) {
    return next();
  }
  protect(req, res, next);
});

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

app.get("/", (req, res) => {
  res.json({ mensaje: "¡Servidor de Admin-Gimnasios funcionando correctamente!" });
});

app.use((req, res) => {
  if (req.url.startsWith("/api")) {
    res.status(404).json({ mensaje: `Ruta no encontrada: ${req.method} ${req.url}` });
  } else {
    res.status(404).json({ mensaje: "Ruta no encontrada" });
  }
});

app.use((err, req, res, next) => {
  console.error("❌ Error en el servidor:", err.stack);
  res.status(500).json({ mensaje: "Error interno", error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});
