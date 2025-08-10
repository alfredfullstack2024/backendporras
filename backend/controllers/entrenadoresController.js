const mongoose = require("mongoose");
const Entrenador = require("../models/Entrenador");

const agregarEntrenador = async (req, res) => {
  try {
    console.log("Datos recibidos:", req.body);
    const { nombre, apellido, correo, telefono, especialidad, diasHorarios } = req.body;
    if (!nombre || !apellido || !correo || !especialidad || !Array.isArray(diasHorarios) || diasHorarios.length === 0) {
      return res.status(400).json({ mensaje: "Datos requeridos faltan o inválidos" });
    }
    const entrenador = new Entrenador({
      nombre,
      apellido,
      correo,
      telefono,
      especialidad,
      diasHorarios,
      creadoPor: req.user._id,
    });
    const savedEntrenador = await entrenador.save();
    console.log("Entrenador guardado en MongoDB:", savedEntrenador);
    res.status(201).json(savedEntrenador);
  } catch (error) {
    console.error("Error al agregar entrenador:", error.message, error.stack);
    res.status(500).json({ mensaje: "Error al agregar entrenador", detalle: error.message });
  }
};

const listarEntrenadores = async (req, res) => {
  try {
    const entrenadores = await Entrenador.find().sort({ createdAt: -1 });
    res.json(entrenadores);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al listar entrenadores", detalle: error.message });
  }
};

module.exports = { agregarEntrenador, listarEntrenadores };
