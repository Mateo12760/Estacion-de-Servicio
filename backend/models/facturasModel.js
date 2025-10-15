// models/facturasModel.js
const { db } = require('../data/db');

// Obtener todas las facturas
const getAllFacturas = () => {
  return new Promise((resolve, reject) => {
    db.all(`
      SELECT f.*, v.total AS total_venta
      FROM facturas f
      JOIN ventas v ON f.venta_id = v.id
    `, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

// Obtener factura por ID
const getFacturaById = (id) => {
  return new Promise((resolve, reject) => {
    db.get(`
      SELECT f.*, v.total AS total_venta
      FROM facturas f
      JOIN ventas v ON f.venta_id = v.id
      WHERE f.id = ?
    `, [id], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

// Crear factura
const createFactura = ({ venta_id, tipo, total }) => {
  return new Promise((resolve, reject) => {
    db.run(
      "INSERT INTO facturas (venta_id, tipo, total, fecha) VALUES (?, ?, ?, datetime('now'))",
      [venta_id, tipo, total],
      function (err) {
        if (err) reject(err);
        else resolve(this.lastID);
      }
    );
  });
};

// Actualizar factura
const updateFactura = (id, { tipo }) => {
  return new Promise((resolve, reject) => {
    db.run(
      "UPDATE facturas SET tipo=? WHERE id=?",
      [tipo, id],
      function (err) {
        if (err) reject(err);
        else resolve(this.changes);
      }
    );
  });
};

// Eliminar factura
const deleteFactura = (id) => {
  return new Promise((resolve, reject) => {
    db.run("DELETE FROM facturas WHERE id=?", [id], function (err) {
      if (err) reject(err);
      else resolve(this.changes);
    });
  });
};

module.exports = {
  getAllFacturas,
  getFacturaById,
  createFactura,
  updateFactura,
  deleteFactura
};

