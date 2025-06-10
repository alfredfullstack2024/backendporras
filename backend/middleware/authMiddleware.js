const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const Usuario = require("../models/Usuario");

// Middleware para verificar el token y autenticar al usuario
const protect = asyncHandler(async (req, res, next) => {
  let token;

  console.log("Header Authorization recibido:", req.headers.authorization);

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      console.log("Token recibido:", token);

      if (!process.env.JWT_SECRET) {
        throw new Error("Clave secreta JWT no definida en .env");
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Token decodificado:", decoded);

      // Cargar usuario desde la base de datos
      const userFromDB = await Usuario.findById(decoded.id).select("-password");
      if (!userFromDB) {
        console.log("Usuario no encontrado para el ID:", decoded.id);
        return res
          .status(401)
          .json({ message: "No autorizado, usuario no encontrado" });
      }

      // Usar solo datos de la base de datos
      req.user = userFromDB.toObject();
      console.log("Usuario cargado desde DB:", req.user);
      req.user.rol = userFromDB.rol || "user"; // Fallback a "user" si no hay rol
      // Normalizar el rol a minúsculas y asegurar consistencia
      if (req.user.rol) {
        req.user.rol = req.user.rol.toLowerCase().trim();
        const validRoles = ["admin", "entrenador", "recepcionista", "cliente"];
        req.user.rol = validRoles.includes(req.user.rol)
          ? req.user.rol
          : "user";
        console.log("Rol normalizado:", req.user.rol);
      }
      console.log("Usuario encontrado - Datos completos:", req.user);

      next();
    } catch (error) {
      console.error(
        "Error al verificar el token:",
        error.name,
        error.message,
        error.expiredAt
      );
      return res.status(401).json({
        message: "No autorizado, token inválido o expirado",
        error: error.message,
      });
    }
  } else {
    console.log("Encabezado Authorization no encontrado o mal formado");
    return res
      .status(401)
      .json({ message: "No autorizado, token no proporcionado" });
  }
});

// Middleware para verificar el rol del usuario
const verificarRol = (...rolesPermitidos) => {
  return asyncHandler(async (req, res, next) => {
    const user = req.user;
    console.log("Antes de verificar rol - req.user:", user);
    console.log(
      "Verificando rol - Usuario rol:",
      user?.rol,
      "Roles permitidos:",
      rolesPermitidos
    );
    if (!user || !user.rol || !rolesPermitidos.includes(user.rol)) {
      console.log("Acceso denegado: Rol no autorizado para el usuario:", user);
      return res
        .status(403)
        .json({ message: "Acceso denegado: Rol no autorizado" });
    }
    console.log(`Acceso permitido para rol ${user.rol}`);
    next();
  });
};

// Normalizar rutas dinámicas
const normalizeRoute = (ruta) => {
  console.log("Ruta original:", ruta);
  ruta = ruta.endsWith("/") ? ruta.slice(0, -1) : ruta;
  console.log("Ruta después de eliminar barra final:", ruta);

  const normalized = ruta
    .replace(
      /\/rutinas\/consultarRutinasPorNumeroIdentificacion\/\w+/,
      "/rutinas/consultar/:numeroIdentificacion"
    )
    .replace(
      /\/rutinas\/consultar\/\w+/,
      "/rutinas/consultar/:numeroIdentificacion"
    )
    .replace(/\/rutinas\/asignar\/\w+/, "/rutinas/asignar/:id")
    .replace(/\/rutinas\/\w+/, "/rutinas/:id")
    .replace(
      /\/clases\/consultar\/\w+/,
      "/clases/consultar/:numeroIdentificacion"
    )
    .replace(
      /\/pagos\/consultar\/\w+/,
      "/pagos/consultar/:numeroIdentificacion"
    )
    .replace(
      /\/composicion-corporal\/cliente\/\w+/,
      "/composicion-corporal/cliente/:identificacion"
    )
    .replace(/\/composicion-corporal$/, "/composicion-corporal")
    .replace(/\/entrenadores\/\w+/, "/entrenadores/:id")
    .replace(/\/entrenadores$/, "/entrenadores")
    .replace(/\/clientes\/\w+/, "/clientes/:id")
    .replace(/\/clientes$/, "/clientes")
    .replace(/\/membresias\/\w+/, "/membresias/:id")
    .replace(/\/membresias$/, "/membresias")
    .replace(/\/productos\/\w+/, "/productos/:id")
    .replace(/\/productos$/, "/productos")
    .replace(/\/users\/\w+/, "/users/:id")
    .replace(/\/users$/, "/users")
    .replace(/\/contabilidad\/\w+/, "/contabilidad/:id")
    .replace(/\/contabilidad$/, "/contabilidad")
    .replace(/\/indicadores\/\w+/, "/indicadores/:id")
    .replace(/\/indicadores$/, "/indicadores")
    .replace(/\/asistencias\/\w+/, "/asistencias/:id")
    .replace(/\/asistencias$/, "/asistencias")
    .replace(/\/usuarios$/, "/usuarios")
    .replace(/\/usuarios\/\w+/, "/usuarios/:id");

  console.log("Ruta completamente normalizada:", normalized);
  return normalized;
};

// Middleware para verificar permisos específicos por ruta
const verificarPermisos = (rolesPermitidos) => {
  return asyncHandler(async (req, res, next) => {
    const user = req.user;
    const metodo = req.method.toUpperCase();
    const baseUrl = req.baseUrl || "";
    const path = req.path || "";
    const ruta = normalizeRoute(baseUrl + path);

    console.log("Base URL:", baseUrl);
    console.log("Path:", path);
    console.log("Verificando permisos para:", metodo, ruta);
    console.log("Usuario completo antes de permisos:", user);
    console.log("Roles permitidos pasados:", rolesPermitidos);

    if (!user || !user.rol) {
      console.log("Error: Rol no definido para el usuario:", user);
      return res
        .status(403)
        .json({ message: "Acceso denegado: Rol no definido" });
    }

    // Admin tiene acceso completo
    if (user.rol === "admin") {
      console.log("Usuario admin, acceso permitido");
      return next();
    }

    // Verificar si el rol del usuario está en los roles permitidos
    if (!rolesPermitidos.includes(user.rol)) {
      console.log(
        `Acceso denegado: ${user.rol} no está en los roles permitidos ${rolesPermitidos}`
      );
      return res
        .status(403)
        .json({ message: "No tienes permisos para realizar esta acción." });
    }

    console.log(`Acceso permitido para ${user.rol} en ${metodo} ${ruta}`);
    next();
  });
};

// Definición de permisos por rol
const permisosPorRol = {
  recepcionista: {
    rutas: {
      "/api/clases/disponibles": ["GET"],
      "/api/clases/registrar": ["POST"],
      "/api/clases/consultar/:numeroIdentificacion": ["GET"],
      "/api/clases/inscritos": ["GET"],
      "/api/pagos": ["GET", "POST"],
      "/api/pagos/:id": ["GET", "PUT"],
      "/api/pagos/consultar/:numeroIdentificacion": ["GET"],
      "/api/pagos/ingresos": ["GET"],
      "/api/rutinas/consultar/:numeroIdentificacion": ["GET"],
      "/api/composicion-corporal/cliente/:identificacion": ["GET"],
      "/api/clientes": ["GET", "POST"],
      "/api/clientes/:id": ["GET", "PUT"],
      "/api/membresias": ["GET", "POST"],
      "/api/membresias/:id": ["GET", "PUT"],
      "/api/productos": ["GET"],
      "/api/productos/:id": ["GET"],
      "/api/entrenadores": ["GET", "POST"], // Añadido permiso para crear entrenadores
    },
  },
  entrenador: {
    rutas: {
      "/api/rutinas": ["POST", "GET"],
      "/api/rutinas/:id": ["PUT"],
      "/api/rutinas/asignar": ["POST"],
      "/api/rutinas/asignar/:id": ["PUT"],
      "/api/rutinas/consultar/:numeroIdentificacion": ["GET"],
      "/api/composicion-corporal": ["POST", "GET"],
      "/api/composicion-corporal/cliente/:identificacion": ["GET"],
      "/api/entrenadores": ["POST", "GET", "PUT"],
      "/api/entrenadores/:id": ["GET", "PUT"],
      "/api/clases/inscritos": ["GET"],
      "/api/clientes": ["GET"],
      "/api/clientes/:id": ["GET"],
    },
  },
  admin: {
    rutas: {
      "/api/usuarios": ["GET", "POST"],
      "/api/usuarios/:id": ["GET", "PUT", "DELETE"],
    },
  },
};

module.exports = { protect, verificarRol, verificarPermisos, permisosPorRol };
