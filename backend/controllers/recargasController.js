const recargasModel = require('../models/recargasModel');
const naftasModel = require('../models/naftasModel');

// ✅ Obtener todas las recargas
const getRecargas = (req, res) => {
  recargasModel.getAllRecargas((err, rows) => {
    if (err) return res.status(500).json({ error: 'Error al obtener recargas' });
    res.json({ recargas: rows });
  });
};

// ✅ Obtener recarga por ID
const getRecargaById = (req, res) => {
  const { id } = req.params;
  if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

  recargasModel.getRecargaById(id, (err, row) => {
    if (err) return res.status(500).json({ error: 'Error al obtener recarga' });
    if (!row) return res.status(404).json({ error: 'Recarga no encontrada' });
    res.json({ recarga: row });
  });
};

// ✅ Crear nueva recarga (flujo completo con actualización de stock)
const createRecarga = (req, res) => {
  const { nafta_id, litros } = req.body;

  if (!nafta_id || !litros)
    return res.status(400).json({ error: 'Faltan datos obligatorios' });
  if (isNaN(nafta_id) || isNaN(litros))
    return res.status(400).json({ error: 'Parámetros inválidos' });
  if (litros <= 0)
    return res.status(400).json({ error: 'Cantidad de litros inválida' });

  // Verificar que la nafta exista
  naftasModel.getNaftaById(nafta_id, (err, nafta) => {
    if (err) return res.status(500).json({ error: 'Error al buscar nafta' });
    if (!nafta) return res.status(404).json({ error: 'Nafta no encontrada' });

    // Crear la recarga
    recargasModel.createRecarga(nafta_id, litros, (err, recargaId) => {
      if (err) return res.status(500).json({ error: 'Error al crear la recarga' });

      // Actualizar stock de la nafta
      const nuevoStock = nafta.stock_litros + litros;
      naftasModel.updateNafta(nafta_id, nafta.nombre, nafta.precio_por_litro, nuevoStock, (err) => {
        if (err) return res.status(500).json({ error: 'Error al actualizar stock' });

        res.status(201).json({
          message: 'Recarga creada correctamente',
          recargaId,
          nuevoStock
        });
      });
    });
  });
};

module.exports = {
  getRecargas,
  getRecargaById,
  createRecarga
};