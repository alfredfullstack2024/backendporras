const express = require("express");
const router = express.Router();
const Entrenador = require("../models/Entrenador");
const { protect, verificarPermisos } = require("../middleware/authMiddleware");

router.get(
  "/",
  protect,
  verificarPermisos(["admin", "entrenador"]), // Solo admin y entrenador tienen acceso
  async (req, res) => {
    try {
      const entrenadores = await Entrenador.find().lean();
      res.json(entrenadores);
    } catch (error) {
      res.status(500).json({ mensaje: "Error al listar entrenadores" });
    }
  }
);

module.exports = router;
