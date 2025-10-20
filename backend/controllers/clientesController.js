const clientesModel = require('../models/clientesModel');

// Obtener todos los clientes
const getAllClientes = (req, res) => {
  clientesModel.getAllClientes((err, rows) => {
    if (err) {
      console.error('Error al obtener clientes:', err);
      return res.status(500).json({ error: 'Error al obtener los clientes', details: err });
    }
    res.status(200).json(rows);
  });
};

// Obtener un cliente por ID
const getClienteById = (req, res) => {
  const { id } = req.params;
  clientesModel.getClienteById(id, (err, row) => {
    if (err) {
      console.error('Error al obtener cliente:', err);
      return res.status(500).json({ error: 'Error al obtener el cliente', details: err });
    }
    if (!row) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }
    res.status(200).json(row);
  });
};

// Crear un nuevo cliente
const createCliente = (req, res) => {
  const { nombre, apellido, dni, email, telefono } = req.body;

  if (!nombre || !apellido || !dni) {
    return res.status(400).json({ error: 'Nombre, apellido y DNI son obligatorios' });
  }

  clientesModel.createCliente(nombre, apellido, dni, email, telefono, (err, result) => {
    if (err, result) {
      console.error('Error al crear cliente:', err);
      return res.status(500).json({ error: 'Error al crear el cliente', details: err });
    }

    // Devuelve el cliente creado con ID
    res.status(201).json({
      id: result.id,
      nombre,
      apellido,
      dni,
      email,
      telefono
    });
  });
};

// Actualizar un cliente existente
const updateCliente = (req, res) => {
  const { id } = req.params;
  const { nombre, apellido, dni, email, telefono } = req.body;

  if (!nombre || !apellido || !dni) {
    return res.status(400).json({ error: 'Nombre, apellido y DNI son obligatorios' });
  }

  clientesModel.updateCliente(id, nombre, apellido, dni, email, telefono, (err, result) => {
    if (err) {
      console.error('Error al actualizar cliente:', err);
      return res.status(500).json({ error: 'Error al actualizar el cliente', details: err });
    }
    if (result.changes === 0) {
      return res.status(404).json({ message: 'Cliente no encontrado o sin cambios' });
    }
    res.status(200).json({ message: 'Cliente actualizado correctamente' });
  });
};

// Eliminar un cliente
const deleteCliente = (req, res) => {
  const { id } = req.params;

  clientesModel.deleteCliente(id, (err, result) => {
    if (err) {
      console.error('Error al eliminar cliente:', err);
      return res.status(500).json({ error: 'Error al eliminar el cliente', details: err });
    }
    if (result.changes === 0) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }
    res.status(200).json({ message: 'Cliente eliminado correctamente' });
  });
};

module.exports = {
  getAllClientes,
  getClienteById,
  createCliente,
  updateCliente,
  deleteCliente
};