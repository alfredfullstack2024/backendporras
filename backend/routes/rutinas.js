const express = require("express");
const router = express.Router();
const rutinasController = require("../controllers/rutinasController");
const { protect } = require("../middleware/authMiddleware");

// Rutas para gestionar rutinas
router.post("/rutinas", protect, rutinasController.crearRutina);
router.get("/rutinas", protect, rutinasController.listarRutinas);
router.put("/rutinas/:id", protect, rutinasController.actualizarRutina);

// Rutas para gestionar asignaciones de rutinas
router.post("/rutinas/asignar", protect, rutinasController.asignarRutina);
router.put("/rutinas/asignar/:id", protect, rutinasController.actualizarAsignacionRutina);
router.delete("/rutinas/asignar/:id", protect, rutinasController.eliminarAsignacionRutina);
router.get("/rutinas/consultarRutinasPorNumeroIdentificacion/:numeroIdentificacion", protect, rutinasController.consultarRutinasPorNumeroIdentificacion);

module.exports = router;
