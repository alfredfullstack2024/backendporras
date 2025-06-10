const express = require("express");
const router = express.Router();
const Clase = require("../models/Clase");
const { protect, verificarPermisos } = require("../middleware/authMiddleware");

// Ruta para registrar una clase (solo admin)
router.post(
  "/registrar",
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
      res.status(500).json({ mensaje: "Error al registrar la clase", error: error.message });
    }
  }
);

// Ruta para listar clases
router.get(
  "/",
  protect,
  async (req, res) => {
    try {
      const clases = await Clase.find().lean();
      res.json(clases);
    } catch (error) {
      res.status(500).json({ mensaje: "Error al listar las clases", error: error.message });
    }
  }
);

// Ruta para obtener una clase por ID
router.get(
  "/:id",
  protect,
  async (req, res) => {
    try {
      const clase = await Clase.findById(req.params.id).lean();
      if (!clase) {
        return res.status(404).json({ mensaje: "Clase no encontrada" });
      }
      res.json(clase);
    } catch (error) {
      res.status(500).json({ mensaje: "Error al obtener la clase", error: error.message });
    }
  }
);

module.exports = router;
