const express = require("express");
const router = express.Router();
const Clase = require("../models/Clase");
const { protect, verificarPermisos } = require("../middleware/authMiddleware");

router.get(
  "/",
  protect,
  verificarPermisos(["admin"]), // Solo admin tiene acceso
  async (req, res) => {
    try {
      const clases = await Clase.find().lean();
      res.json(clases);
    } catch (error) {
      res.status(500).json({ mensaje: "Error al listar clases" });
    }
  }
);

module.exports = router;
