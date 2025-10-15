const express = require('express');
const router = express.Router();
const ventasController = require('../controllers/ventasController');

// Middleware: validar ID
const validateId = (req, res, next) => {
  const id = parseInt(req.params.id);
  if (isNaN(id) || id <= 0) return res.status(400).json({ error: 'ID inválido' });
  next();
};

// Middleware: validar cuerpo de venta
const validateVentaBody = (req, res, next) => {
  const { cliente_id, nafta_id, litros, monto } = req.body;
  if (!cliente_id || !nafta_id || !litros || (req.method !== 'POST' && !monto))
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  if (isNaN(cliente_id) || isNaN(nafta_id) || isNaN(litros) || (monto && isNaN(monto)))
    return res.status(400).json({ error: 'Datos inválidos' });
  if (litros <= 0) return res.status(400).json({ error: 'Cantidad de litros inválida' });
  next();
};

// Rutas
router.get('/', ventasController.getVentas);
router.get('/:id', validateId, ventasController.getVentaById);
router.post('/', validateVentaBody, ventasController.createVenta);
router.put('/:id', validateId, validateVentaBody, ventasController.updateVenta);
router.delete('/:id', validateId, ventasController.deleteVenta);

module.exports = router;


