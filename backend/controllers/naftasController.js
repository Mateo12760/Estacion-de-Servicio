const naftasModel = require('../models/naftasModel');

// Listar todas las naftas
const getNaftas = (req, res) => {
    naftasModel.getAllNaftas((err, rows) => {
        if (err) return res.status(500).json({ error: 'Error al obtener naftas' });
        res.status(200).json({ naftas: rows });
    });
};

// Obtener nafta por ID
const getNaftaById = (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id) || id <= 0) return res.status(400).json({ error: 'ID inválido' });

    naftasModel.getNaftaById(id, (err, row) => {
        if (err) return res.status(500).json({ error: 'Error al buscar nafta' });
        if (!row) return res.status(404).json({ error: 'Nafta no encontrada' });
        res.status(200).json({ nafta: row });
    });
};

// Crear nueva nafta
const createNafta = (req, res) => {
    const { nombre, precio_por_litro, stock_litros } = req.body;

    if (!nombre || typeof precio_por_litro !== 'number' || precio_por_litro <= 0 || typeof stock_litros !== 'number' || stock_litros < 0) {
        return res.status(400).json({ error: 'Datos inválidos' });
    }

    naftasModel.createNafta(nombre, precio_por_litro, stock_litros, function(err) {
        if (err) return res.status(500).json({ error: 'Error al crear nafta' });
        res.status(201).json({ message: 'Nafta creada correctamente', naftaId: this.lastID });
    });
};

// Actualizar nafta existente
const updateNafta = (req, res) => {
    const id = parseInt(req.params.id);
    const { nombre, precio_por_litro, stock_litros } = req.body;

    if (isNaN(id) || id <= 0) return res.status(400).json({ error: 'ID inválido' });
    if (!nombre || typeof precio_por_litro !== 'number' || precio_por_litro <= 0 || typeof stock_litros !== 'number' || stock_litros < 0) {
        return res.status(400).json({ error: 'Datos inválidos' });
    }

    naftasModel.updateNafta(id, nombre, precio_por_litro, stock_litros, (err) => {
        if (err) return res.status(500).json({ error: 'Error al actualizar nafta' });
        res.status(200).json({ message: 'Nafta actualizada correctamente' });
    });
};

// Eliminar nafta
const deleteNafta = (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id) || id <= 0) return res.status(400).json({ error: 'ID inválido' });

    // Opcional: verificar si hay ventas asociadas antes de eliminar

    naftasModel.deleteNafta(id, (err) => {
        if (err) return res.status(500).json({ error: 'Error al eliminar nafta' });
        res.status(200).json({ message: 'Nafta eliminada correctamente' });
    });
};

module.exports = {
    getNaftas,
    getNaftaById,
    createNafta,
    updateNafta,
    deleteNafta
};
