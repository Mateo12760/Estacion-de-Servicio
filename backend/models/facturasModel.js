const { db } = require('../data/db');

// Obtener todas las facturas
const getAllFacturas = (callback) => {
  db.all(`
    SELECT f.id, f.tipo, f.fecha, f.total, c.nombre || ' ' || c.apellido AS cliente
    FROM facturas f
    LEFT JOIN clientes c ON f.cliente_id = c.id
    ORDER BY f.fecha DESC
  `, callback);
};

// Obtener factura por ID
const getFacturaById = (id, callback) => {
  db.get(`
    SELECT f.id, f.tipo, f.fecha, f.total, c.nombre || ' ' || c.apellido AS cliente
    FROM facturas f
    LEFT JOIN clientes c ON f.cliente_id = c.id
    WHERE f.id = ?
  `, [id], callback);
};

// Crear factura manual (opcional)
const createFactura = (tipo, cliente_id, total, callback) => {
  db.run(
    "INSERT INTO facturas (tipo, cliente_id, total, fecha) VALUES (?, ?, ?, datetime('now'))",
    [tipo, cliente_id, total],
    function (err) {
      callback(err, { id: this.lastID });
    }
  );
};

// Actualizar tipo de factura
const updateFactura = (id, tipo, callback) => {
  db.run(
    "UPDATE facturas SET tipo=? WHERE id=?",
    [tipo, id],
    function (err) {
      callback(err, { changes: this.changes });
    }
  );
};

// Eliminar factura
const deleteFactura = (id, callback) => {
  db.run("DELETE FROM facturas WHERE id=?", [id], function (err) {
    callback(err, { changes: this.changes });
  });
};

module.exports = {
  getAllFacturas,
  getFacturaById,
  createFactura,
  updateFactura,
  deleteFactura
};
