// models/AuthModel.js
const { db } = require ('../data/db')
const bcrypt = require('bcryptjs');

// Crear un nuevo usuario
const createUser = (nombre, email, password, rol = 'empleado', callback) => {
  const hash = bcrypt.hashSync(password, 10);
  db.run(
    "INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?)",
    [nombre, email, hash, rol],
    function (err) {
      callback(err, { id: this.lastID });
    }
  );
};

// Obtener usuario por email
const getUserByEmail = (email, callback) => {
  db.get(
    "SELECT * FROM usuarios WHERE email = ?",
    [email],
    callback
  );
};

// Obtener usuario por id
const getUserById = (id, callback) => {
  db.get(
    "SELECT * FROM usuarios WHERE id = ?",
    [id],
    callback
  );
};

// Verificar contraseña
const verifyPassword = (password, hash) => {
  return bcrypt.compareSync(password, hash);
};

module.exports = {
  createUser,
  getUserByEmail,
  getUserById,
  verifyPassword
};