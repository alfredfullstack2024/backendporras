const express = require("express");
const router = express.Router();
const Clase = require("../models/Clase");
const { protect, verificarPermisos } = require("../middleware/authMiddleware");

// Ruta para listar clases disponibles (solo admin)
router.get(
  "/disponibles",
  protect,
  verificarPermisos(["admin"]),
  async (req, res) => {
    try {
      const clases = await Clase.find({ estado: "disponible" }).lean();
      res.json(clases);
    } catch (error) {
      res.status(500).json({ mensaje: "Error al listar las clases", error: error.message });
    }
  }
);

module.exports = router;
