const express = require('express');
const router = express.Router();
const facturasController = require('../controllers/facturasController');

// Middleware: validar ID en rutas con :id
const validateId = (req, res, next) => {
  const id = parseInt(req.params.id);
  if (isNaN(id) || id <= 0) {
    return res.status(400).json({ error: 'ID inválido' });
  }
  next();
};

// Middleware: validar datos de factura en POST y PUT
const validateFacturaBody = (req, res, next) => {
  const { venta_id, tipo } = req.body;

  if (!venta_id || !tipo) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }
  if (isNaN(venta_id)) {
    return res.status(400).json({ error: 'venta_id debe ser numérico' });
  }
  if (!['B', 'C'].includes(tipo.toUpperCase())) {
    return res.status(400).json({ error: 'Tipo de factura inválido (B o C)' });
  }

  // Normalizamos el tipo a mayúscula
  req.body.tipo = tipo.toUpperCase();

  next();
};

// Rutas de facturas
router.get('/', facturasController.getFacturas);
router.get('/:id', validateId, facturasController.getFacturaById);
router.post('/', validateFacturaBody, facturasController.createFactura);
router.put('/:id', validateId, validateFacturaBody, facturasController.updateFactura);
router.delete('/:id', validateId, facturasController.deleteFactura);

module.exports = router;