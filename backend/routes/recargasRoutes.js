const express = require('express');
const router = express.Router();
const recargasController = require('../controllers/recargasController');

// Middleware: validar ID
const validateId = (req, res, next) => {
  const id = parseInt(req.params.id);
  if (isNaN(id) || id <= 0) {
    return res.status(400).json({ error: 'ID inválido' });
  }
  next();
};

// Middleware: validar cuerpo de recarga
const validateRecargaBody = (req, res, next) => {
  const { nafta_id, litros } = req.body;
  if (!nafta_id || !litros)
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  if (isNaN(nafta_id) || isNaN(litros))
    return res.status(400).json({ error: 'Datos inválidos' });
  if (litros <= 0)
    return res.status(400).json({ error: 'Los litros deben ser mayores a 0' });
  next();
};

// ✅ Rutas para recargas
router.get('/', recargasController.getRecargas);
router.get('/:id', validateId, recargasController.getRecargaById);
router.post('/', validateRecargaBody, recargasController.createRecarga);

module.exports = router;
