const express = require("express");
const cors = require("cors");
const { MongoClient } = require("realm");
const router = require("./routes/index");
const migrationRoutes = require("./routes/migrationRoutes");

const app = express();

// Configura CORS para tu frontend
app.use(
  cors({
    origin: "https://frontendporras-m7dzbit26-alfredos-projects-a028b04c.vercel.app",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

// Middleware para parsear JSON
app.use(express.json());

// Conexión a MongoDB con Realm
const appId = process.env.REALM_APP_ID;
const apiKey = process.env.REALM_API_KEY;
const realmApp = new Realm.App({ id: appId });

async function connectToMongo() {
  try {
    const credentials = Realm.Credentials.apiKey(apiKey);
    const user = await realmApp.logIn(credentials);
    const client = user.mongoClient("mongodb-atlas");
    console.log("Conectado a MongoDB via Realm");
    return client.db("gimnasio_db");
  } catch (err) {
    console.error("Error de conexión:", err);
  }
}

// Inyecta la conexión en las rutas
app.use(async (req, res, next) => {
  req.db = await connectToMongo();
  next();
});

// Monta las rutas
app.use("/api", router);
app.use("/api/migrate", migrationRoutes); // Mantén esta ruta si la usaste antes

// Exporta la app para Vercel
module.exports = app;
