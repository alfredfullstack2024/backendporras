const express = require("express");
const router = express.Router();
const Entrenador = require("../models/Entrenador");
const { protect, verificarPermisos } = require("../middleware/authMiddleware");

// Ruta para listar entrenadores (solo admin y entrenador)
router.get(
  "/",
  protect,
  verificarPermisos(["admin", "entrenador"]),
  async (req, res) => {
    try {
      const entrenadores = await Entrenador.find().lean();
      res.json(entrenadores);
    } catch (error) {
      res.status(500).json({ mensaje: "Error al listar entrenadores", error: error.message });
    }
  }
);

// Ruta para crear un entrenador (solo admin)
router.post(
  "/",
  protect,
  verificarPermisos(["admin"]),
  async (req, res) => {
    try {
      const { nombre, apellido, correo, especialidad } = req.body;
      if (!nombre || !apellido || !correo || !especialidad) {
        return res.status(400).json({ mensaje: "Todos los campos son requeridos" });
      }
      const nuevoEntrenador = new Entrenador({ nombre, apellido, correo, especialidad });
      const entrenadorGuardado = await nuevoEntrenador.save();
      res.status(201).json(entrenadorGuardado);
    } catch (error) {
      res.status(500).json({ mensaje: "Error al crear el entrenador", error: error.message });
    }
  }
);

module.exports = router;
