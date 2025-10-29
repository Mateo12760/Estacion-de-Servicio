const ventasModel = require('../models/ventasModel');
const clientesModel = require('../models/clientesModel');
const naftasModel = require('../models/naftasModel');
const facturasModel = require('../models/facturasModel');

// Obtener todas las ventas
const getVentas = (req, res) => {
  ventasModel.getAllVentas((err, rows) => {
    if (err) return res.status(500).json({ error: 'Error al obtener ventas', details: err });
    res.status(200).json({ ventas: rows });
  });
};

// Obtener venta por ID
const getVentaById = (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id) || id <= 0) return res.status(400).json({ error: 'ID de venta inválido' });

  ventasModel.getVentaById(id, (err, row) => {
    if (err) return res.status(500).json({ error: 'Error al obtener la venta', details: err });
    if (!row) return res.status(404).json({ error: 'Venta no encontrada' });
    res.status(200).json({ venta: row });
  });
};

// Crear nueva venta
const createVenta = async (req, res) => {
  try {
    const { cliente_id, nafta_id, litros } = req.body;
    if (!cliente_id || !nafta_id || !litros)
      return res.status(400).json({ error: 'Faltan datos obligatorios' });
    if (isNaN(cliente_id) || isNaN(nafta_id) || isNaN(litros) || litros <= 0)
      return res.status(400).json({ error: 'Datos inválidos' });

    // Verificar cliente
    const cliente = await new Promise((resolve, reject) =>
      clientesModel.getClienteById(cliente_id, (err, row) => err ? reject(err) : resolve(row))
    );
    if (!cliente) return res.status(404).json({ error: 'Cliente no encontrado' });

    // Verificar nafta
    const nafta = await new Promise((resolve, reject) =>
      naftasModel.getNaftaById(nafta_id, (err, row) => err ? reject(err) : resolve(row))
    );
    if (!nafta) return res.status(404).json({ error: 'Nafta no encontrada' });
    if (nafta.stock_litros < litros) return res.status(400).json({ error: 'Stock insuficiente' });

    // Calcular monto
    const monto = nafta.precio_por_litro * litros;

    // Crear venta
    const ventaId = await new Promise((resolve, reject) =>
      ventasModel.createVenta(cliente_id, nafta_id, litros, monto, (err, id) => err ? reject(err) : resolve(id))
    );

    // Actualizar stock manualmente si querés (aunque el trigger ya lo hace)
    const nuevoStock = nafta.stock_litros - litros;
    await new Promise((resolve, reject) =>
      naftasModel.updateNafta(nafta_id, nafta.nombre, nafta.precio_por_litro, nuevoStock, err => err ? reject(err) : resolve())
    );

    // Crear factura automática tipo C
    const facturaId = await facturasModel.createFactura({ venta_id: ventaId, tipo: 'C', total: monto });

    // Vincular factura a venta
    await new Promise((resolve, reject) =>
      ventasModel.linkFacturaToVenta(ventaId, facturaId, err => err ? reject(err) : resolve())
    );

    res.status(201).json({
      message: 'Venta creada correctamente',
      venta: { id: ventaId, cliente_id, nafta_id, litros, monto, factura_id: facturaId },
      nuevoStock
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear la venta', details: err });
  }
};

// Actualizar venta
const updateVenta = (req, res) => {
  const id = parseInt(req.params.id);
  const { cliente_id, nafta_id, factura_id, litros, monto } = req.body;
  if (!id || !cliente_id || !nafta_id || !litros || !monto ||
      isNaN(id) || isNaN(cliente_id) || isNaN(nafta_id) || isNaN(litros) || isNaN(monto))
    return res.status(400).json({ error: 'Datos inválidos para actualizar venta' });

  ventasModel.updateVenta(id, cliente_id, nafta_id, factura_id || null, litros, monto, err => {
    if (err) return res.status(500).json({ error: 'Error al actualizar la venta', details: err });
    res.status(200).json({ message: 'Venta actualizada correctamente' });
  });
};

// Eliminar venta
const deleteVenta = (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id) || id <= 0) return res.status(400).json({ error: 'ID de venta inválido' });

  ventasModel.deleteVenta(id, err => {
    if (err) return res.status(500).json({ error: 'Error al eliminar la venta', details: err });
    res.status(200).json({ message: 'Venta eliminada correctamente' });
  });
};

module.exports = {
  getVentas,
  getVentaById,
  createVenta,
  updateVenta,
  deleteVenta
};