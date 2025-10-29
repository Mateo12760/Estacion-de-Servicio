// models/ventasModel.js
const { db } = require('../data/db');

// Obtener todas las ventas
const getAllVentas = (callback) => {
  const query = `
    SELECT v.id, n.nombre AS nafta, v.litros, v.monto, v.empleado, v.fecha, 
           v.factura_id, f.tipo AS tipo_factura, f.total AS total_factura
    FROM ventas v
    LEFT JOIN naftas n ON v.nafta_id = n.id
    LEFT JOIN facturas f ON v.factura_id = f.id
    ORDER BY v.fecha DESC
  `;
  db.all(query, callback);
};

// Obtener venta por ID
const getVentaById = (id, callback) => {
  const query = `
    SELECT v.id, n.nombre AS nafta, v.litros, v.monto, v.empleado, v.fecha,
           v.factura_id, f.tipo AS tipo_factura, f.total AS total_factura
    FROM ventas v
    LEFT JOIN naftas n ON v.nafta_id = n.id
    LEFT JOIN facturas f ON v.factura_id = f.id
    WHERE v.id = ?
  `;
  db.get(query, [id], callback);
};

// Crear nueva venta
const createVenta = (nafta_id, litros, monto, empleado, factura_id, callback) => {
  if (!nafta_id || !litros || !monto) {
    return callback(new Error('Faltan datos obligatorios'));
  }

  db.run(
    `INSERT INTO ventas (nafta_id, litros, monto, empleado, factura_id)
     VALUES (?, ?, ?, ?, ?)`,
    [nafta_id, litros, monto, empleado || 'Desconocido', factura_id || null],
    function (err) {
      if (err) callback(err);
      else callback(null, { id: this.lastID });
    }
  );
};

// Actualizar venta (por ejemplo, cambiar empleado o monto)
const updateVenta = (id, { litros, monto, empleado, factura_id }, callback) => {
  db.run(
    `UPDATE ventas
     SET litros = ?, monto = ?, empleado = ?, factura_id = ?
     WHERE id = ?`,
    [litros, monto, empleado, factura_id, id],
    function (err) {
      callback(err, { changes: this.changes });
    }
  );
};

// Eliminar venta
const deleteVenta = (id, callback) => {
  db.run("DELETE FROM ventas WHERE id = ?", [id], function (err) {
    callback(err, { changes: this.changes });
  });
};

module.exports = {
  getAllVentas,
  getVentaById,
  createVenta,
  updateVenta,
  deleteVenta
};