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

// Solo recepcionistas, admins y usuarios pueden acceder (según permisosPorRol)
router.get(
  "/disponibles",
  protect,
  verificarPermisos(["admin", "recepcionista"]),
  obtenerClasesDisponibles
);
router.post(
  "/registrar",
  protect,
  verificarPermisos(["admin", "recepcionista", "user"]),
  registrarClienteEnClase
);
router.get(
  "/consultar/:numeroIdentificacion",
  protect,
  verificarPermisos(["admin", "recepcionista", "user"]),
  consultarClasesPorNumeroIdentificacion
);
router.get(
  "/inscritos/:claseId",
  protect,
  verificarPermisos(["admin", "recepcionista"]),
  obtenerInscritosPorClase
);
router.get(
  "/",
  protect,
  verificarPermisos(["admin", "recepcionista"]),
  obtenerClases
);

module.exports = router;
