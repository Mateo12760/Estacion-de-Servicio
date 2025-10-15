const express = require('express');
const router = express.Router();
const clientesController = require('../controllers/clientesController');

// Middleware para validar ID en rutas con :id
const validateId = (req, res, next) => {
    const id = parseInt(req.params.id);
    if (isNaN(id) || id <= 0) {
        return res.status(400).json({ error: 'ID inválido' });
    }
    next();
};

// Middleware para validar datos en POST y PUT
const validateClienteBody = (req, res, next) => {
    const { nombre, apellido, dni, email, telefono } = req.body;
    if (!nombre || !apellido || !dni) {
        return res.status(400).json({ error: 'Nombre, apellido y DNI son obligatorios' });
    }
    // Opcional: validar formato de email y teléfono
    next();
};

// Rutas para clientes
router.get('/', clientesController.getAllClientes); 
router.get('/:id', validateId, clientesController.getClienteById);
router.post('/', validateClienteBody, clientesController.createCliente);
router.put('/:id', validateId, validateClienteBody, clientesController.updateCliente);
router.delete('/:id', validateId, clientesController.deleteCliente);

module.exports = router;
