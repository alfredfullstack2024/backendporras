const Entrenador = require("../models/Entrenador");
const RegistroClases = require("../models/RegistroClases");
const Cliente = require("../models/Cliente");
const Clase = require("../models/Clase");

exports.obtenerClasesDisponibles = async (req, res) => {
  try {
    console.log("Solicitud GET /api/clases/disponibles recibida");
    const entrenadores = await Entrenador.find().lean();

    if (!entrenadores || entrenadores.length === 0) {
      console.log("No se encontraron entrenadores en la base de datos.");
      return res
        .status(404)
        .json({ message: "No se encontraron clases disponibles." });
    }

    const clasesDisponibles = await Promise.all(
      entrenadores.flatMap(async (entrenador) => {
        if (!entrenador.clases || !Array.isArray(entrenador.clases)) {
          console.log(`Entrenador ${entrenador._id} no tiene clases definidas.`);
          return [];
        }
        return await Promise.all(
          entrenador.clases
            .filter((clase) => !clase.estado || clase.estado === "activa")
            .map(async (clase) => {
              const primerDia = Array.isArray(clase.dias) && clase.dias.length > 0 ? clase.dias[0] : null;
              const registros = await RegistroClases.countDocuments({
                entrenadorId: entrenador._id.toString(),
                nombreClase: clase.nombreClase,
                dia: primerDia?.dia,
                horarioInicio: primerDia?.horarioInicio,
                horarioFin: primerDia?.horarioFin,
              });
              const claseDoc = await Clase.findOne({ nombre: clase.nombreClase }).lean();
              const capacidadDisponible = claseDoc ? claseDoc.capacidadDisponible - registros : clase.capacidadMaxima - registros;

              return {
                entrenadorId: entrenador._id.toString(),
                entrenadorNombre: entrenador.nombre,
                especialidad: entrenador.especialidad,
                nombreClase: clase.nombreClase,
                dia: primerDia?.dia || "No especificado",
                horarioInicio: primerDia?.horarioInicio || "No especificado",
                horarioFin: primerDia?.horarioFin || "No especificado",
                capacidadMaxima: clase.capacidadMaxima,
                capacidadDisponible: capacidadDisponible > 0 ? capacidadDisponible : 0,
              };
            })
        );
      })
    ).then((result) => result.flat());

    if (clasesDisponibles.length === 0) {
      console.log("No se encontraron clases activas en los entrenadores.");
      return res
        .status(404)
        .json({ message: "No se encontraron clases disponibles." });
    }

    console.log("Clases disponibles enviadas:", clasesDisponibles);
    res.json(clasesDisponibles);
  } catch (error) {
    console.error("Error al obtener clases disponibles:", error.stack);
    res.status(500).json({
      message: "Error interno del servidor al obtener clases.",
      error: error.message,
    });
  }
};

exports.registrarClienteEnClase = async (req, res) => {
  try {
    const {
      numeroIdentificacion,
      entrenadorId,
      nombreClase,
      dia,
      horarioInicio,
      horarioFin,
    } = req.body;

    console.log("🚀 [REGISTRO] Datos recibidos para registrar:", req.body);

    if (
      !numeroIdentificacion ||
      !entrenadorId ||
      !nombreClase ||
      !dia ||
      !horarioInicio ||
      !horarioFin
    ) {
      console.log("❌ [REGISTRO] Faltan campos requeridos:", {
        numeroIdentificacion,
        entrenadorId,
        nombreClase,
        dia,
        horarioInicio,
        horarioFin,
      });
      return res.status(400).json({
        message: "Todos los campos son requeridos.",
      });
    }
    console.log("✅ [REGISTRO] Todos los campos están presentes.");

    const cliente = await Cliente.findOne({ numeroIdentificacion });
    if (!cliente) {
      console.log("❌ [REGISTRO] Cliente no encontrado:", numeroIdentificacion);
      return res
        .status(404)
        .json({ message: "Número de identificación no encontrado." });
    }
    console.log("✅ [REGISTRO] Cliente encontrado:", cliente._id);

    const entrenador = await Entrenador.findById(entrenadorId);
    if (!entrenador) {
      console.log("❌ [REGISTRO] Entrenador no encontrado:", entrenadorId);
      return res.status(404).json({ message: "Entrenador no encontrado." });
    }
    console.log("✅ [REGISTRO] Entrenador encontrado:", entrenador._id);

    if (!entrenador.clases || !Array.isArray(entrenador.clases)) {
      console.log("❌ [REGISTRO] El entrenador no tiene clases definidas:", entrenador._id);
      return res.status(404).json({ message: "El entrenador no tiene clases definidas." });
    }
    console.log("✅ [REGISTRO] Clases del entrenador verificadas.");

    const clase = entrenador.clases.find(
      (c) =>
        c.nombreClase === nombreClase &&
        c.dias.some(
          (d) =>
            d.dia === dia &&
            d.horarioInicio === horarioInicio &&
            d.horarioFin === horarioFin
        )
    );
    if (!clase) {
      console.log("❌ [REGISTRO] Clase no encontrada:", { nombreClase, dia, horarioInicio, horarioFin });
      return res
        .status(404)
        .json({ message: "Clase no encontrada en el entrenador." });
    }
    console.log("✅ [REGISTRO] Clase encontrada:", clase.nombreClase);

    const diaClase = clase.dias.find(
      (d) =>
        d.dia === dia &&
        d.horarioInicio === horarioInicio &&
        d.horarioFin === horarioFin
    );
    if (!diaClase) {
      console.log("❌ [REGISTRO] Día y horario no encontrados:", { dia, horarioInicio, horarioFin });
      return res
        .status(404)
        .json({ message: "Día y horario no encontrados para esta clase." });
    }
    console.log("✅ [REGISTRO] Día y horario encontrados.");

    const registros = await RegistroClases.countDocuments({
      entrenadorId,
      nombreClase,
      dia,
      horarioInicio,
      horarioFin,
    });
    const claseDoc = await Clase.findOne({ nombre: nombreClase });
    if (!claseDoc) {
      console.log("❌ [REGISTRO] Clase no encontrada en modelo Clase:", nombreClase);
      return res.status(404).json({ message: "Clase no encontrada en la base de datos." });
    }
    if (registros >= claseDoc.capacidadMaxima) {
      console.log("❌ [REGISTRO] Capacidad máxima alcanzada:", claseDoc.capacidadMaxima);
      return res
        .status(400)
        .json({ message: "Capacidad máxima de la clase alcanzada." });
    }
    console.log("✅ [REGISTRO] Capacidad disponible:", claseDoc.capacidadMaxima - registros);

    const registro = new RegistroClases({
      numeroIdentificacion,
      nombre: cliente.nombre,
      apellido: cliente.apellido,
      entrenadorId,
      nombreClase,
      dia,
      horarioInicio,
      horarioFin,
    });
    await registro.save();
    console.log("💾 [REGISTRO] Registro guardado:", registro._id);

    // Actualizar capacidadDisponible
    claseDoc.capacidadDisponible -= 1;
    await claseDoc.save();
    console.log("🔄 [REGISTRO] Capacidad actualizada:", claseDoc.capacidadDisponible);

    res.status(201).json({
      message: "Cliente registrado en clase con éxito",
      registro,
    });
  } catch (error) {
    console.error("❌ [REGISTRO] Error al registrar cliente en clase:", error.stack);
    res.status(500).json({
      message: "Error interno del servidor al registrar cliente en clase",
      error: error.message,
    });
  }
};

// Mantener las demás exportaciones (consultarClasesPorNumeroIdentificacion, obtenerInscritosPorClase, obtenerClases) sin cambios
exports.consultarClasesPorNumeroIdentificacion = require("./claseController").consultarClasesPorNumeroIdentificacion;
exports.obtenerInscritosPorClase = require("./claseController").obtenerInscritosPorClase;
exports.obtenerClases = require("./claseController").obtenerClases;
