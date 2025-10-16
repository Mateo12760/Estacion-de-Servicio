const express = require('express');
const router = express.Router();
const naftasController = require('../controllers/naftasController');

// Middleware para validar ID
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
        return res.status(400).json({ error: 'Datos inválidos' });
    }
    next();
};

// Middleware específico para PATCH (solo precio)
const validatePrecio = (req, res, next) => {
    const { precio_por_litro } = req.body;
    if (typeof precio_por_litro !== 'number' || precio_por_litro <= 0) {
        return res.status(400).json({ error: 'Precio inválido' });
    }
    next();
};

// Rutas
router.get('/', naftasController.getNaftas);
router.get('/:id', validateId, naftasController.getNaftaById);
router.post('/', validateNaftaBody, naftasController.createNafta);
router.put('/:id', validateId, validateNaftaBody, naftasController.updateNafta);
router.patch('/:id/precio', validateId, validatePrecio, naftasController.updateNaftaPrice); 
router.delete('/:id', validateId, naftasController.deleteNafta);

module.exports = router;

