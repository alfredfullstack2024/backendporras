const express = require("express");
const router = express.Router();
const clienteController = require("../controllers/clienteController");
const membresiaController = require("../controllers/membresiaController");
const productoController = require("../controllers/productoController");
const indicadoresController = require("../controllers/indicadoresController");

// Rutas existentes (ejemplo)
router.get("/clientes", clienteController.obtenerClientes);
router.post("/clientes", clienteController.crearCliente);
router.get("/clientes/:id", clienteController.obtenerClientePorId);
router.put("/clientes/:id", clienteController.actualizarCliente);
router.delete("/clientes/:id", clienteController.eliminarCliente);

router.get("/membresias", membresiaController.obtenerMembresias);
router.post("/membresias", membresiaController.crearMembresia);
router.get("/membresias/:id", membresiaController.obtenerMembresiaPorId);
router.put("/membresias/:id", membresiaController.actualizarMembresia);
router.delete("/membresias/:id", membresiaController.eliminarMembresia);

router.get("/productos", productoController.listarProductos);
router.post("/productos", productoController.agregarProducto);
router.get("/productos/:id", productoController.obtenerProductoPorId);
router.put("/productos/:id", productoController.editarProducto);
router.delete("/productos/:id", productoController.eliminarProducto);

// Nueva ruta para indicadores
router.get("/indicadores", indicadoresController.obtenerIndicadores);

module.exports = router;
