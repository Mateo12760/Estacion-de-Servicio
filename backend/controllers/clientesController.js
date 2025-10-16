const clientesModel = require('../models/clientesModel');

// Obtener todos los clientes
const getAllClientes = (req, res) => {
  clientesModel.getAllClientes((err, rows) => {
    if (err) {
      console.error('Error al obtener clientes:', err);
      res.status(500).json({ error: 'Error al obtener los clientes' });
    } else {
      res.status(200).json(rows);
    }
  });
};

// Obtener un cliente por ID
const getClienteById = (req, res) => {
  const { id } = req.params;
  clientesModel.getClienteById(id, (err, row) => {
    if (err) {
      console.error('Error al obtener cliente:', err);
      res.status(500).json({ error: 'Error al obtener el cliente' });
    } else if (!row) {
      res.status(404).json({ message: 'Cliente no encontrado' });
    } else {
      res.status(200).json(row);
    }
  });
};

// Crear un nuevo cliente
const createCliente = (req, res) => {
  const { nombre, apellido, dni, email, telefono } = req.body;

  if (!nombre || !apellido || !dni) {
    return res.status(400).json({ error: 'Nombre, apellido y DNI son obligatorios' });
  }

  clientesModel.createCliente(nombre, apellido, dni, email, telefono, (err) => {
    if (err) {
      console.error('Error al crear cliente:', err);
      res.status(500).json({ error: 'Error al crear el cliente' });
    } else {
      res.status(201).json({ 
        id: result.id,
        nombre,
        apellido,
        dni,
        email,
        telefono
       });
    }
  });
};

// Actualizar un cliente existente
const updateCliente = (req, res) => {
  const { id } = req.params;
  const { nombre, apellido, dni, email, telefono } = req.body;

  if (!nombre || !apellido || !dni) {
    return res.status(400).json({ error: 'Nombre, apellido y DNI son obligatorios' });
  }

  clientesModel.updateCliente(id, nombre, apellido, dni, email, telefono, (err) => {
    if (err) {
      console.error('Error al actualizar cliente:', err);
      res.status(500).json({ error: 'Error al actualizar el cliente' });
    } else {
      res.status(200).json({ message: 'Cliente actualizado correctamente' });
    }
  });
};

// Eliminar un cliente
const deleteCliente = (req, res) => {
  const { id } = req.params;
  clientesModel.deleteCliente(id, (err) => {
    if (err) {
      console.error('Error al eliminar cliente:', err);
      res.status(500).json({ error: 'Error al eliminar el cliente' });
    } else {
      res.status(200).json({ message: 'Cliente eliminado correctamente' });
    }
  });
};

module.exports = {
  getAllClientes,
  getClienteById,
  createCliente,
  updateCliente,
  deleteCliente
};
