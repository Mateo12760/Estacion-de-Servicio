const {db} = require('../data/db');

// Obtener todos los clientes
const getAllClientes = (callback) => {
  db.all("SELECT * FROM clientes", callback);
};

// Obtener cliente por ID
const getClienteById = (id, callback) => {
  db.get("SELECT * FROM clientes WHERE id=?", [id], callback);
};

// Obtener cliente por DNI
const getClienteByDni = (dni, callback) => {
  db.get("SELECT * FROM clientes WHERE dni=?", [dni], callback);
};

// Crear nuevo cliente
const createCliente = (nombre, apellido, dni, email, telefono, callback) => {
  db.run(
    "INSERT INTO clientes (nombre, apellido, dni, email, telefono) VALUES (?, ?, ?, ?, ?)",
    [nombre, apellido, dni, email, telefono],
    function (err) {
      callback(err, { id: this.lastID });
    }
  );
};

// Actualizar cliente existente
const updateCliente = (id, nombre, apellido, dni, email, telefono, callback) => {
  db.run(
    "UPDATE clientes SET nombre=?, apellido=?, dni=?, email=?, telefono=? WHERE id=?",
    [nombre, apellido, dni, email, telefono, id],
    function (err) {
      callback(err, { changes: this.changes });
    }
  );
};

// Eliminar cliente
const deleteCliente = (id, callback) => {
  db.run("DELETE FROM clientes WHERE id=?", [id], function (err) {
    callback(err, { changes: this.changes });
  });
};

module.exports = {
  getAllClientes,
  getClienteById,
  getClienteByDni,
  createCliente,
  updateCliente,
  deleteCliente
};