// ventasModel.js
const { db } = require('../data/db');

// Obtener todas las ventas
const getAllVentas = (callback) => {
  db.all("SELECT * FROM ventas", callback);
};

// Obtener venta por ID
const getVentaById = (id, callback) => {
  if (typeof id !== 'number' || id <= 0) {
    return callback(new Error('ID de venta inválido'));
  }
  db.get("SELECT * FROM ventas WHERE id=?", [id], callback);
};

// Crear nueva venta con validaciones
const createVenta = (cliente_id, nafta_id, litros, monto, callback) => {
  if (
    typeof cliente_id !== 'number' || cliente_id <= 0 ||
    typeof nafta_id !== 'number' || nafta_id <= 0 ||
    typeof litros !== 'number' || litros <= 0 ||
    typeof monto !== 'number' || monto <= 0
  ) {
    return callback(new Error('Parámetros inválidos para crear venta'));
  }

  const sql = `
    INSERT INTO ventas (cliente_id, nafta_id, litros, monto)
    VALUES (?, ?, ?, ?)
  `;
  db.run(sql, [cliente_id, nafta_id, litros, monto], function(err) {
    if (callback) callback(err, this.lastID); // devuelve el id de la venta creada
  });
};

// Vincular factura a venta
const linkFacturaToVenta = (ventaId, facturaId, callback) => {
  if (
    typeof ventaId !== 'number' || ventaId <= 0 ||
    typeof facturaId !== 'number' || facturaId <= 0
  ) {
    return callback(new Error('Parámetros inválidos para vincular factura'));
  }

  const sql = `
    UPDATE ventas
    SET factura_id = ?
    WHERE id = ?
  `;
  db.run(sql, [facturaId, ventaId], callback);
};

// Actualizar venta con validaciones
const updateVenta = (id, cliente_id, nafta_id, factura_id, litros, monto, callback) => {
  if (
    typeof id !== 'number' || id <= 0 ||
    typeof cliente_id !== 'number' || cliente_id <= 0 ||
    typeof nafta_id !== 'number' || nafta_id <= 0 ||
    (factura_id !== null && typeof factura_id !== 'number') ||
    typeof litros !== 'number' || litros <= 0 ||
    typeof monto !== 'number' || monto <= 0
  ) {
    return callback(new Error('Parámetros inválidos para actualizar venta'));
  }

  const sql = `
    UPDATE ventas
    SET cliente_id = ?, nafta_id = ?, factura_id = ?, litros = ?, monto = ?
    WHERE id = ?
  `;
  db.run(sql, [cliente_id, nafta_id, factura_id, litros, monto, id], callback);
};

// Eliminar venta
const deleteVenta = (id, callback) => {
  if (typeof id !== 'number' || id <= 0) {
    return callback(new Error('ID de venta inválido'));
  }
  const sql = `
    DELETE FROM ventas
    WHERE id = ?
  `;
  db.run(sql, [id], callback);
};

module.exports = {
  getAllVentas,
  getVentaById,
  createVenta,
  linkFacturaToVenta,
  updateVenta,
  deleteVenta
};