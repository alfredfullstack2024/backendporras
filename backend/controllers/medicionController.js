const Medicion = require("../models/Medicion");

// Crear nueva medición
exports.crearMedicion = async (req, res) => {
  try {
    const { deportista, problemasFisicos, notasAdicionales, ejercicios, pasaSiguienteNivel } = req.body;

    // Calcular promedio
    const promedioGlobal =
      ejercicios.reduce((sum, ej) => sum + ej.calificacion, 0) / ejercicios.length;

    const nuevaMedicion = new Medicion({
      deportista,
      problemasFisicos,
      notasAdicionales,
      ejercicios,
      promedioGlobal,
      pasaSiguienteNivel
    });

    await nuevaMedicion.save();
    res.status(201).json(nuevaMedicion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener historial de un deportista
exports.obtenerHistorial = async (req, res) => {
  try {
    const { idDeportista } = req.params;
    const historial = await Medicion.find({ deportista: idDeportista })
      .sort({ fecha: -1 });
    res.json(historial);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
