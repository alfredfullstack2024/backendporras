const express = require("express");
const router = express.Router();
const Clase = require("../models/Clase");
const { protect } = require("../middleware/authMiddleware");

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
