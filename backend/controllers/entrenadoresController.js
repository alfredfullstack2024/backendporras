const mongoose = require("mongoose");
const Entrenador = require("../models/Entrenador");

// Agregar un nuevo entrenador (solo esta función para probar)
const agregarEntrenador = async (req, res) => {
  try {
    console.log("Iniciando agregarEntrenador...");
    console.log("Datos recibidos:", req.body);
    console.log("Usuario autenticado:", req.user);

    const { nombre, apellido, correo, telefono, especialidad, diasHorarios } = req.body;

    if (!nombre || !apellido || !correo || !especialidad || !Array.isArray(diasHorarios) || diasHorarios.length === 0) {
      return res.status(400).json({
        mensaje: "Nombre, apellido, correo, especialidad y al menos un día/horario son requeridos",
      });
    }

    if (!req.user || !req.user._id) {
      return res.status(401).json({ mensaje: "Usuario no autenticado" });
    }

    diasHorarios.forEach((dh, index) => {
      if (!dh.dia || !dh.horario) {
        return res.status(400).json({
          mensaje: `Día/Horario inválido en índice ${index}: ambos campos son requeridos`,
        });
      }
    });

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
    res.status(201).json({ mensaje: "Entrenador creado con éxito", entrenador: savedEntrenador });
  } catch (error) {
    console.error("Error al agregar entrenador:", error.message, error.stack);
    res.status(500).json({
      mensaje: "Error al agregar entrenador",
      detalle: error.message,
      stack: error.stack,
    });
  }
};

module.exports = { agregarEntrenador }; // Solo exporta esta función para probar
