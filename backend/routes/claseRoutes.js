const express = require("express");
const router = express.Router();
const Clase = require("../models/Clase");
const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, async (req, res) => {
  try {
    const clases = await Clase.find().lean();
    res.json(clases);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al listar clases", error: error.message });
  }
});

router.post("/registrar", protect, async (req, res) => {
  try {
    const { nombreClase, dias, capacidadMaxima } = req.body;
    if (!nombreClase || !capacidadMaxima) {
      return res.status(400).json({ mensaje: "Nombre y capacidad máxima son requeridos" });
    }
    const nuevaClase = new Clase({ nombreClase, dias: dias || [], capacidadMaxima });
    const claseGuardada = await nuevaClase.save();
    res.status(201).json(claseGuardada);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al registrar clase", error: error.message });
  }
});

router.delete("/:id", protect, async (req, res) => {
  try {
    const clase = await Clase.findByIdAndDelete(req.params.id);
    if (!clase) return res.status(404).json({ mensaje: "Clase no encontrada" });
    res.json({ mensaje: "Clase eliminada" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar clase", error: error.message });
  }
});

module.exports = router;
