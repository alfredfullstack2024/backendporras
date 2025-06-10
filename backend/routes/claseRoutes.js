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

// Ruta para crear una clase (solo admin)
router.post(
  "/disponibles",
  protect,
  verificarPermisos(["admin"]),
  async (req, res) => {
    try {
      const { nombre, horario } = req.body;
      if (!nombre || !horario) {
        return res.status(400).json({ mensaje: "Nombre y horario son requeridos" });
      }
      const nuevaClase = new Clase({ nombre, horario });
      const claseGuardada = await nuevaClase.save();
      res.status(201).json(claseGuardada);
    } catch (error) {
      res.status(500).json({ mensaje: "Error al crear la clase", error: error.message });
    }
  }
);

module.exports = router;
