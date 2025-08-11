const express = require("express");
const router = express.Router();
const { crearMedicion, obtenerHistorial } = require("../controllers/medicionController");

// Crear medición
router.post("/", crearMedicion);

// Obtener historial de un deportista
router.get("/:idDeportista", obtenerHistorial);

module.exports = router;
