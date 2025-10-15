const express = require('express');
const router = express.Router();
const naftasController = require('../controllers/naftasController');

// Middleware para validar ID en rutas con :id
const validateId = (req, res, next) => {
    const id = parseInt(req.params.id);
    if (isNaN(id) || id <= 0) {
        return res.status(400).json({ error: 'ID inválido' });
    }
    next();
};

// Middleware para validar body en POST y PUT
const validateNaftaBody = (req, res, next) => {
    const { nombre, precio_por_litro, stock_litros } = req.body;
    if (
        !nombre ||
        typeof precio_por_litro !== 'number' || precio_por_litro <= 0 ||
        typeof stock_litros !== 'number' || stock_litros < 0
    ) {
        return res.status(400).json({ error: 'Datos inválidos: nombre, precio_por_litro y stock_litros son obligatorios y deben ser correctos' });
    }
    next();
};

// Rutas de Naftas
router.get('/', naftasController.getNaftas);
router.get('/:id', validateId, naftasController.getNaftaById);
router.post('/', validateNaftaBody, naftasController.createNafta);
router.put('/:id', validateId, validateNaftaBody, naftasController.updateNafta);
router.delete('/:id', validateId, naftasController.deleteNafta);

module.exports = router;

