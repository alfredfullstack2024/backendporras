const express = require("express");
const router = express.Router();
const entrenadorController = require("../controllers/entrenadoresController");
const { protect, verificarPermisos } = require("../middleware/authMiddleware");

console.log("Configurando rutas para entrenadores...");

// Rutas protegidas con permisos basados en authMiddleware.js
router.get(
  "/",
  protect,
  verificarPermisos(["admin", "entrenador"]), // Solo admin o entrenador pueden listar
  entrenadorController.listarEntrenadores
);
router.post(
  "/",
  protect,
  verificarPermisos(["admin"]), // Solo admin puede agregar
  entrenadorController.agregarEntrenador
);
router.get(
  "/:id",
  protect,
  verificarPermisos(["admin", "entrenador"]), // Solo admin o entrenador pueden ver detalles
  entrenadorController.obtenerEntrenadorPorId
);
router.put(
  "/:id",
  protect,
  verificarPermisos(["admin"]), // Solo admin puede editar
  entrenadorController.editarEntrenador
);
router.delete(
  "/:id",
  protect,
  verificarPermisos(["admin"]), // Solo admin puede eliminar
  entrenadorController.eliminarEntrenador
);

module.exports = router;
