const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware"); // Asegúrate de que este middleware esté disponible
const clienteController = require("../controllers/clienteController");
const membresiaController = require("../controllers/membresiaController");
const productoController = require("../controllers/productoController");
const indicadoresController = require("../controllers/indicadoresController");
const medicionPorristasController = require("../controllers/medicionPorristasController"); // Asumido

// Rutas para clientes
router.get("/clientes", clienteController.obtenerClientes);
router.post("/clientes", clienteController.crearCliente);
router.get("/clientes/:id", clienteController.obtenerClientePorId);
router.put("/clientes/:id", clienteController.actualizarCliente);
router.delete("/clientes/:id", clienteController.eliminarCliente);

// Rutas para membresías
router.get("/membresias", membresiaController.obtenerMembresias);
router.post("/membresias", membresiaController.crearMembresia);
router.get("/membresias/:id", membresiaController.obtenerMembresiaPorId);
router.put("/membresias/:id", membresiaController.actualizarMembresia);
router.delete("/membresias/:id", membresiaController.eliminarMembresia);

// Rutas para productos
router.get("/productos", productoController.listarProductos);
router.post("/productos", productoController.agregarProducto);
router.get("/productos/:id", productoController.obtenerProductoPorId);
router.put("/productos/:id", productoController.editarProducto);
router.delete("/productos/:id", productoController.eliminarProducto);

// Rutas para indicadores
router.get("/indicadores", indicadoresController.obtenerIndicadores);

// Rutas para mediciones porristas
router.post("/medicion-porristas", protect, medicionPorristasController.crearMedicionPorristas); // Asumido
router.get("/medicion-porristas", protect, medicionPorristasController.obtenerMedicionesPorristas); // Asumido
router.put("/medicion-porristas/:id", protect, medicionPorristasController.editarMedicionPorristas); // Asumido
router.delete("/medicion-porristas/:id", protect, medicionPorristasController.eliminarMedicionPorristas); // Nuevo

module.exports = router;
