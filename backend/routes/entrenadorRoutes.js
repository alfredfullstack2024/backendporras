const express = require("express");
const router = express.Router();
const Entrenador = require("../models/Entrenador");
const { protect, verificarPermisos } = require("../middleware/authMiddleware");

// Ruta para listar entrenadores
router.get(
  "/",
  protect,
  async (req, res) => {
    try {
      const entrenadores = await Entrenador.find().lean();
      res.json(entrenadores);
    } catch (error) {
      res.status(500).json({ mensaje: "Error al listar entrenadores", error: error.message });
    }
  }
);

// Ruta para obtener un entrenador por ID
router.get(
  "/:id",
  protect,
  async (req, res) => {
    try {
      const entrenador = await Entrenador.findById(req.params.id).lean();
      if (!entrenador) {
        return res.status(404).json({ mensaje: "Entrenador no encontrado" });
      }
      res.json(entrenador);
    } catch (error) {
      res.status(500).json({ mensaje: "Error al obtener el entrenador", error: error.message });
    }
  }
);

// Ruta para actualizar un entrenador
router.put(
  "/:id",
  protect,
  async (req, res) => {
    try {
      const { nombre, apellido, correo, especialidad } = req.body;
      const entrenador = await Entrenador.findByIdAndUpdate(
        req.params.id,
        { nombre, apellido, correo, especialidad, updatedAt: Date.now() },
        { new: true, runValidators: true }
      ).lean();
      if (!entrenador) {
        return res.status(404).json({ mensaje: "Entrenador no encontrado" });
      }
      res.json(entrenador);
    } catch (error) {
      res.status(500).json({ mensaje: "Error al actualizar el entrenador", error: error.message });
    }
  }
);

module.exports = router;
