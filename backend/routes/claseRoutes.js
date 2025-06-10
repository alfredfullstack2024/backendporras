const express = require("express");
const router = express.Router();
const { protect, verificarPermisos } = require("../middleware/authMiddleware");
const {
  obtenerClasesDisponibles,
  registrarClienteEnClase,
  consultarClasesPorNumeroIdentificacion,
  obtenerInscritosPorClase,
  obtenerClases,
} = require("../controllers/claseController");

// Solo recepcionistas y admins pueden acceder (según permisosPorRol)
router.get(
  "/disponibles",
  protect,
  verificarPermisos(),
  obtenerClasesDisponibles
);
router.post(
  "/registrar",
  protect,
  verificarPermisos(),
  registrarClienteEnClase
);
router.get(
  "/consultar/:numeroIdentificacion",
  protect,
  verificarPermisos(),
  consultarClasesPorNumeroIdentificacion
);
router.get(
  "/inscritos",
  protect,
  verificarPermisos(),
  obtenerInscritosPorClase
);
router.get("/", protect, verificarPermisos(), obtenerClases);

module.exports = router;
