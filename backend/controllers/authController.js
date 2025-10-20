const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { registerUser, findUserByEmail } = require("../models/authModel");

const SECRET_KEY = "nafta_super_segura"; // ⚠ En producción guardalo en variables de entorno (.env)

// Registro
async function register(req, res) {
  try {
    const { nombre, email, password, rol } = req.body;
    if (!nombre || !email || !password) {
      return res.status(400).json({ message: "Faltan campos obligatorios" });
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "El email ya está registrado" });
    }

    const user = await registerUser(nombre, email, password, rol);
    res.status(201).json({ message: "Usuario creado exitosamente", user });
  } catch (error) {
    res.status(500).json({ message: "Error en el registro", error });
  }
}

// Login
async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email y contraseña son obligatorios" });

    const user = await findUserByEmail(email);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) return res.status(401).json({ message: "Contraseña incorrecta" });

    const token = jwt.sign({ id: user.id, email: user.email, rol: user.rol }, SECRET_KEY, {
      expiresIn: "4h",
    });

    res.status(200).json({
      message: "Login exitoso",
      token,
      user: { id: user.id, nombre: user.nombre, rol: user.rol },
    });
  } catch (error) {
    res.status(500).json({ message: "Error al iniciar sesión", error });
  }
}

// Middleware para verificar token
function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(403).json({ message: "Token requerido" });

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Token inválido o expirado" });

    req.user = decoded;
    next();
  });
}

module.exports = {
  register,
  login,
  verifyToken,
};