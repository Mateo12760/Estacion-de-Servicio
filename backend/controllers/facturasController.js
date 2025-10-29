const facturasModel = require('../models/facturasModel');
const ventasModel = require('../models/ventasModel');

// ✅ Obtener todas las facturas
const getFacturas = async (req, res) => {
  try {
    const facturas = await facturasModel.getAllFacturas();
    res.status(200).json(facturas);
  } catch (err) {
    console.error('Error en getFacturas:', err);
    res.status(500).json({ error: 'Error al obtener las facturas', details : err });
  }
};

// ✅ Obtener factura por ID
const getFacturaById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id) || id <= 0)
      return res.status(400).json({ error: 'ID inválido' });

    const factura = await facturasModel.getFacturaById(id);
    if (!factura)
      return res.status(404).json({ error: 'Factura no encontrada' });

    res.status(200).json(factura);
  } catch (err) {
    console.error('Error en getFacturaById:', err);
    res.status(500).json({ error: 'Error al obtener la factura', details: err });
  }
};

// ✅ Crear factura (vinculada a venta)
const createFactura = async (req, res) => {
  try {
    const { venta_id, tipo } = req.body;

    if (!venta_id || !tipo)
      return res.status(400).json({ error: 'Faltan datos obligatorios' });

    if (!['B', 'C'].includes(tipo.toUpperCase()))
      return res.status(400).json({ error: 'Tipo de factura inválido' });

    const venta = await ventasModel.getVentaById(venta_id);
    if (!venta)
      return res.status(404).json({ error: 'Venta no encontrada' });

    const total = venta.total || venta.monto; // ← compatibilidad flexible

    const facturaId = await facturasModel.createFactura({ venta_id, tipo, total });
    const nuevaFactura = await facturasModel.getFacturaById(facturaId);

    res.status(201).json({
      message: 'Factura creada correctamente',
      factura: nuevaFactura
    });
  } catch (err) {
    console.error('Error en createFactura:', err);
    res.status(500).json({ error: 'Error al crear la factura', details: err });
  }
};

// ✅ Actualizar factura
const updateFactura = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { tipo } = req.body;

    if (isNaN(id) || id <= 0)
      return res.status(400).json({ error: 'ID inválido' });

    if (!tipo || !['B', 'C'].includes(tipo.toUpperCase()))
      return res.status(400).json({ error: 'Tipo de factura inválido' });

    const factura = await facturasModel.getFacturaById(id);
    if (!factura)
      return res.status(404).json({ error: 'Factura no encontrada' });

    await facturasModel.updateFactura(id, { tipo });
    const facturaActualizada = await facturasModel.getFacturaById(id);

    res.status(200).json({
      message: 'Factura actualizada correctamente',
      factura: facturaActualizada
    });
  } catch (err) {
    console.error('Error en updateFactura:', err);
    res.status(500).json({ error: 'Error al actualizar la factura', details: err });
  }
};

// ✅ Eliminar factura
const deleteFactura = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id) || id <= 0)
      return res.status(400).json({ error: 'ID inválido' });

    const factura = await facturasModel.getFacturaById(id);
    if (!factura)
      return res.status(404).json({ error: 'Factura no encontrada' });

    await facturasModel.deleteFactura(id);
    res.status(200).json({ message: 'Factura eliminada correctamente' });
  } catch (err) {
    console.error('Error en deleteFactura:', err);
    res.status(500).json({ error: 'Error al eliminar la factura', details: err });
  }
};

module.exports = {
  getFacturas,
  getFacturaById,
  createFactura,
  updateFactura,
  deleteFactura
};