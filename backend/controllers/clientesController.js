const clientesModel = require('../models/clientesModel');

// Obtener todos los clientes
const getAllClientes = (req, res) => {
  clientesModel.getAllClientes((err, clientes) => {
    if (err) {
      console.error('Error al obtener clientes:', err);
      return res.status(500).json({ error: 'Error al obtener los clientes' });
    }
    res.json(clientes);
  });
};

// Obtener cliente por ID
const getClienteById = (req, res) => {
  const { id } = req.params;

  clientesModel.getClienteById(id, (err, cliente) => {
    if (err) {
      console.error('Error al obtener cliente:', err);
      return res.status(500).json({ error: 'Error al obtener el cliente' });
    }
    if (!cliente) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    res.json(cliente);
  });
};

// Crear nuevo cliente
const createCliente = (req, res) => {
  const { nombre, apellido, dni } = req.body;

  if (!nombre || !apellido || !dni) {
    return res.status(400).json({ error: 'Nombre, apellido y DNI son obligatorios' });
  }

  clientesModel.createCliente({ nombre, apellido, dni }, (err, result) => {
    if (err) {
      console.error('Error al crear cliente:', err);
      return res.status(500).json({ error: 'Error al crear el cliente', details: err.message });
    }

    res.status(201).json({
      message: 'Cliente creado correctamente',
      clienteId: result
    });
  });
};

// Actualizar cliente
const updateCliente = (req, res) => {
  const { id } = req.params;
  const { nombre, apellido, dni } = req.body;

  if (!nombre || !apellido || !dni) {
    return res.status(400).json({ error: 'Nombre, apellido y DNI son obligatorios' });
  }

  clientesModel.updateCliente(id, { nombre, apellido, dni }, (err, result) => {
    if (err) {
      console.error('Error al actualizar cliente:', err);
      return res.status(500).json({ error: 'Error al actualizar el cliente' });
    }

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    res.json({ message: 'Cliente actualizado correctamente' });
  });
};

// Eliminar cliente
const deleteCliente = (req, res) => {
  const { id } = req.params;

  clientesModel.deleteCliente(id, (err, result) => {
    if (err) {
      console.error('Error al eliminar cliente:', err);

      // Si la base lanza error por clave foránea, lo aclaramos mejor:
      if (err.message && err.message.includes('FOREIGN KEY')) {
        return res.status(400).json({
          error: 'No se puede eliminar el cliente porque tiene ventas o recargas asociadas'
        });
      }

      return res.status(500).json({ error: 'Error al eliminar el cliente' });
    }

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    res.json({ message: 'Cliente eliminado correctamente' });
  });
};

module.exports = {
  getAllClientes,
  getClienteById,
  createCliente,
  updateCliente,
  deleteCliente
};