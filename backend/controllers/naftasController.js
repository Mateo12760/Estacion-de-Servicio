const naftasModel = require('../models/naftasModel');

// Obtener todas las naftas
const getAllNaftas = (req, res) => {
  naftasModel.getAllNaftas((err, naftas) => {
    if (err) {
      console.error('Error al obtener naftas:', err);
      return res.status(500).json({ error: 'Error al obtener las naftas' });
    }
    res.json(naftas);
  });
};

// Obtener una nafta por ID
const getNaftaById = (req, res) => {
  const { id } = req.params;

  naftasModel.getNaftaById(id, (err, nafta) => {
    if (err) {
      console.error('Error al obtener la nafta:', err);
      return res.status(500).json({ error: 'Error al obtener la nafta' });
    }

    if (!nafta) {
      return res.status(404).json({ error: 'Nafta no encontrada' });
    }

    res.json(nafta);
  });
};

// Crear nueva nafta
const createNafta = (req, res) => {
  const { nombre, precio_por_litro, stock_litros } = req.body;

  if (!nombre || precio_por_litro == null || stock_litros == null) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  naftasModel.createNafta(nombre, Number(precio_por_litro), Number(stock_litros), (err) => {
    if (err) {
      console.error('Error al crear la nafta:', err);
      return res.status(500).json({ error: 'Error al crear la nafta', details: err.message });
    }

    res.status(201).json({ message: 'Nafta creada correctamente' });
  });
};

// Actualizar datos completos de una nafta
const updateNafta = (req, res) => {
  const { id } = req.params;
  const { nombre, precio_por_litro, stock_litros } = req.body;

  if (!nombre || precio_por_litro == null || stock_litros == null) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  naftasModel.updateNafta(id, nombre, Number(precio_por_litro), Number(stock_litros), (err) => {
    if (err) {
      console.error('Error al actualizar la nafta:', err);
      return res.status(500).json({ error: 'Error al actualizar la nafta', details: err.message });
    }

    res.json({ message: 'Nafta actualizada correctamente' });
  });
};

// Actualizar solo el precio de una nafta
const updateNaftaPrice = (req, res) => {
  const { id } = req.params;
  const { nuevoPrecio } = req.body;

  if (nuevoPrecio == null || isNaN(nuevoPrecio) || nuevoPrecio <= 0) {
    return res.status(400).json({ error: 'El nuevo precio debe ser un número válido mayor a 0' });
  }

  naftasModel.updateNaftaPrice(id, Number(nuevoPrecio), (err) => {
    if (err) {
      console.error('Error al actualizar el precio de la nafta:', err);
      return res.status(500).json({ error: 'Error al actualizar el precio de la nafta' });
    }

    res.json({ message: 'Precio de la nafta actualizado correctamente' });
  });
};

// Eliminar una nafta
const deleteNafta = (req, res) => {
  const { id } = req.params;

  naftasModel.deleteNafta(id, (err) => {
    if (err) {
      console.error('Error al eliminar la nafta:', err);

      // Si hay ventas o recargas asociadas, SQLite lanzará error de clave foránea
      if (err.message && err.message.includes('FOREIGN KEY')) {
        return res.status(400).json({
          error: 'No se puede eliminar la nafta porque tiene ventas o recargas asociadas'
        });
      }

      return res.status(500).json({ error: 'Error al eliminar la nafta' });
    }

    res.json({ message: 'Nafta eliminada correctamente' });
  });
};

module.exports = {
  getAllNaftas,
  getNaftaById,
  createNafta,
  updateNafta,
  updateNaftaPrice,
  deleteNafta
};