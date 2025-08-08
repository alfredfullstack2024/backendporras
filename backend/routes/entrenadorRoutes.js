const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  listarEntrenadores,
  agregarEntrenador,
  obtenerEntrenadorPorId,
  editarEntrenador,
  eliminarEntrenador,
} = require("../controllers/entrenadoresController");

// Listar todos los entrenadores
router.get("/", protect, listarEntrenadores);

// Agregar un nuevo entrenador
router.post("/", protect, agregarEntrenador);

// Obtener un entrenador por ID
router.get("/:id", protect, obtenerEntrenadorPorId);

// Editar un entrenador existente
router.put("/:id", protect, editarEntrenador);

// Eliminar un entrenador
router.delete("/:id", protect, eliminarEntrenador);

module.exports = router;
