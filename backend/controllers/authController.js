const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../data/db');

// Clave secreta para JWT
const SECRET_KEY = 'clave_secreta_super_segura';

// ===================== LOGIN =====================
exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: 'Email y contraseña requeridos.' });

  const query = 'SELECT * FROM usuarios WHERE email = ? AND is_active = 1';
  db.get(query, [email], (err, user) => {
    if (err) return res.status(500).json({ message: 'Error interno', error: err.message });
    if (!user) return res.status(401).json({ message: 'Usuario no encontrado o inactivo' });

    // Verificar contraseña
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Contraseña incorrecta' });

    // Generar token
    const token = jwt.sign(
      { id: user.id, email: user.email, rol: user.rol },
      SECRET_KEY,
      { expiresIn: '4h' }
    );

    return res.json({
      message: 'Inicio de sesión exitoso',
      token,
      usuario: { id: user.id, nombre: user.nombre, email: user.email, rol: user.rol }
    });
  });
};

// ===================== REGISTRO =====================
exports.register = (req, res) => {
  const { nombre, email, password, rol } = req.body;

  if (!nombre || !email || !password)
    return res.status(400).json({ message: 'Nombre, email y contraseña son requeridos.' });

  const hashedPassword = bcrypt.hashSync(password, 10);

  const query = `
    INSERT INTO usuarios (nombre, email, password, rol)
    VALUES (?, ?, ?, ?)
  `;
  db.run(query, [nombre, email, hashedPassword, rol || 'empleado'], function (err) {
    if (err) {
      if (err.message.includes('UNIQUE constraint failed'))
        return res.status(400).json({ message: 'El email ya está registrado.' });
      return res.status(500).json({ message: 'Error al registrar usuario.', error: err.message });
    }

    return res.status(201).json({
      message: 'Usuario registrado exitosamente.',
      usuario: { id: this.lastID, nombre, email, rol: rol || 'empleado' }
    });
  });
};

// ===================== LOGOUT =====================
exports.logout = (req, res) => {
  // En JWT el logout se maneja del lado del cliente eliminando el token
  return res.json({ message: 'Sesión cerrada. El token fue invalidado del lado del cliente.' });
};