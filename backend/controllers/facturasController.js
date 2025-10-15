const facturasModel = require('../models/facturasModel');
const ventasModel = require('../models/ventasModel');

const getFacturas = async (req, res) => {
  try {
    const facturas = await facturasModel.getAllFacturas();
    res.json(facturas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener las facturas' });
  }
};

const getFacturaById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const factura = await facturasModel.getFacturaById(id);
    if (!factura) return res.status(404).json({ error: 'Factura no encontrada' });
    res.json(factura);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener la factura' });
  }
};

const createFactura = async (req, res) => {
  try {
    const { venta_id, tipo } = req.body;

    // Validaciones
    if (!venta_id || !tipo) return res.status(400).json({ error: 'Faltan datos' });
    if (!['B', 'C'].includes(tipo)) return res.status(400).json({ error: 'Tipo de factura inválido' });

    const venta = await ventasModel.getVentaById(venta_id);
    if (!venta) return res.status(404).json({ error: 'Venta no encontrada' });

    const total = venta.total;

    const facturaId = await facturasModel.createFactura({ venta_id, tipo, total });
    const nuevaFactura = await facturasModel.getFacturaById(facturaId);

    res.status(201).json(nuevaFactura);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear la factura' });
  }
};

const updateFactura = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { tipo } = req.body;

   if (!['B', 'C'].includes(tipo.toUpperCase()))
   return res.status(400).json({ error: 'Tipo de factura inválido' });


    const factura = await facturasModel.getFacturaById(id);
    if (!factura) return res.status(404).json({ error: 'Factura no encontrada' });

    await facturasModel.updateFactura(id, { tipo });
    const facturaActualizada = await facturasModel.getFacturaById(id);

    res.json(facturaActualizada);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar la factura' });
  }
};

const deleteFactura = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const factura = await facturasModel.getFacturaById(id);
    if (!factura) return res.status(404).json({ error: 'Factura no encontrada' });

    await facturasModel.deleteFactura(id);
    res.json({ message: 'Factura eliminada correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar la factura' });
  }
};

module.exports = {
  getFacturas,
  getFacturaById,
  createFactura,
  updateFactura,
  deleteFactura,
};
