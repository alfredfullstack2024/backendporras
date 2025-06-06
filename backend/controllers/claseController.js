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

    // Extraer todas las clases activas de los entrenadores
    const clasesDisponibles = entrenadores.flatMap((entrenador) =>
      entrenador.clases
        .filter((clase) => !clase.estado || clase.estado === "activa") // Filtrar por estado "activa" si existe
        .map((clase) => ({
          entrenadorId: entrenador._id.toString(),
          entrenadorNombre: entrenador.nombre,
          especialidad: entrenador.especialidad,
          nombreClase: clase.nombreClase,
          dia: clase.dias[0]?.dia || "No especificado",
          horarioInicio: clase.dias[0]?.horarioInicio || "No especificado",
          horarioFin: clase.dias[0]?.horarioFin || "No especificado",
          capacidadMaxima: clase.capacidadMaxima,
        }))
    );

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

    console.log("Datos recibidos para registrar:", req.body);

    if (
      !numeroIdentificacion ||
      !entrenadorId ||
      !nombreClase ||
      !dia ||
      !horarioInicio ||
      !horarioFin
    ) {
      return res.status(400).json({
        message: "Todos los campos son requeridos.",
      });
    }

    const cliente = await Cliente.findOne({ numeroIdentificacion });
    if (!cliente) {
      return res
        .status(404)
        .json({ message: "Número de identificación no encontrado." });
    }

    const entrenador = await Entrenador.findById(entrenadorId);
    if (!entrenador) {
      return res.status(404).json({ message: "Entrenador no encontrado." });
    }

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
      return res
        .status(404)
        .json({ message: "Clase no encontrada en el entrenador." });
    }

    const diaClase = clase.dias.find(
      (d) =>
        d.dia === dia &&
        d.horarioInicio === horarioInicio &&
        d.horarioFin === horarioFin
    );
    if (!diaClase) {
      return res
        .status(404)
        .json({ message: "Día y horario no encontrados para esta clase." });
    }

    const registros = await RegistroClases.find({
      entrenadorId,
      nombreClase,
      dia,
      horarioInicio,
      horarioFin,
    });
    if (registros.length >= clase.capacidadMaxima) {
      return res
        .status(400)
        .json({ message: "Capacidad máxima de la clase alcanzada." });
    }

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
    const nuevoRegistro = await registro.save();

    console.log("Cliente registrado en clase:", nuevoRegistro);
    res.status(201).json({
      message: "Cliente registrado en clase con éxito",
      registro: nuevoRegistro,
    });
  } catch (error) {
    console.error("Error al registrar cliente en clase:", error.message);
    res.status(500).json({
      message: "Error al registrar cliente en clase",
      error: error.message,
    });
  }
};

exports.consultarClasesPorNumeroIdentificacion = async (req, res) => {
  const { numeroIdentificacion } = req.params;

  try {
    const registros = await RegistroClases.find({
      numeroIdentificacion,
    }).lean();
    if (!registros || registros.length === 0) {
      return res
        .status(404)
        .json({ message: "No se encontraron registros para este cliente." });
    }

    const clasesConDetalles = await Promise.all(
      registros.map(async (registro) => {
        const entrenador = await Entrenador.findById(
          registro.entrenadorId
        ).lean();
        return {
          nombreCompleto: `${registro.nombre} ${registro.apellido}`,
          entrenadorNombre: entrenador ? entrenador.nombre : "Desconocido",
          nombreClase: registro.nombreClase,
          dia: registro.dia,
          horarioInicio: registro.horarioInicio,
          horarioFin: registro.horarioFin,
        };
      })
    );
    res.json(clasesConDetalles);
  } catch (error) {
    console.error("Error al consultar clases:", error.message);
    res
      .status(500)
      .json({ message: "Error interno del servidor.", error: error.message });
  }
};

exports.obtenerInscritosPorClase = async (req, res) => {
  try {
    const { entrenadorId, nombreClase, dia, horarioInicio, horarioFin } =
      req.query;

    console.log("Parámetros recibidos en /inscritos:", {
      entrenadorId,
      nombreClase,
      dia,
      horarioInicio,
      horarioFin,
    });

    if (
      !entrenadorId ||
      !nombreClase ||
      !dia ||
      !horarioInicio ||
      !horarioFin
    ) {
      return res.status(400).json({
        message:
          "Todos los parámetros (entrenadorId, nombreClase, dia, horarioInicio, horarioFin) son requeridos.",
      });
    }

    const inscritos = await RegistroClases.find({
      entrenadorId,
      nombreClase: {
        $regex: new RegExp(nombreClase.trim().toLowerCase(), "i"),
      },
      dia: dia.toLowerCase().trim(),
      horarioInicio: horarioInicio.trim().padStart(5, "0"),
      horarioFin: horarioFin.trim().padStart(5, "0"),
    }).lean();

    console.log("Inscritos encontrados:", inscritos);

    if (!inscritos || inscritos.length === 0) {
      return res
        .status(404)
        .json({ message: "No hay inscritos en esta clase." });
    }

    const nombresInscritos = inscritos.map((inscrito) => ({
      nombreCompleto: `${inscrito.nombre} ${inscrito.apellido}`,
    }));

    console.log("Nombres de inscritos devueltos:", nombresInscritos);
    res.json(nombresInscritos);
  } catch (error) {
    console.error("Error al obtener inscritos por clase:", error.message);
    res.status(500).json({
      message: "Error interno del servidor al obtener inscritos.",
      error: error.message,
    });
  }
};

// Método existente para listar todas las clases (puede ajustarse si es necesario)
exports.obtenerClases = async (req, res) => {
  try {
    console.log("Solicitud GET /api/clases recibida");
    const entrenadores = await Entrenador.find().lean();

    if (!entrenadores || entrenadores.length === 0) {
      console.log("No se encontraron entrenadores en la base de datos.");
      return res.status(404).json({ message: "No se encontraron clases." });
    }

    const todasLasClases = entrenadores.flatMap((entrenador) =>
      entrenador.clases.map((clase) => ({
        ...clase,
        entrenadorId: entrenador._id.toString(),
        entrenadorNombre: entrenador.nombre,
        especialidad: entrenador.especialidad,
      }))
    );

    if (todasLasClases.length === 0) {
      console.log("No se encontraron clases en los entrenadores.");
      return res.status(404).json({ message: "No se encontraron clases." });
    }

    console.log("Clases enviadas:", todasLasClases);
    res.json(todasLasClases);
  } catch (error) {
    console.error("Error al obtener clases:", error.stack);
    res.status(500).json({
      message: "Error interno del servidor al obtener clases.",
      error: error.message,
    });
  }
};
