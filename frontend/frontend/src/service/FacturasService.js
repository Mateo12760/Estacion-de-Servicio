// src/services/FacturasService.js
import { fakeApi } from '../data/FakeData.js';

export const FacturasService = {
  // Obtener todas las facturas
  async getAll() {
    try {
      const data = await fakeApi.getFacturas();
      console.log('🧾 Facturas obtenidas correctamente:', data);
      return data;
    } catch (error) {
      console.error('❌ Error al obtener facturas:', error);
      throw error;
    }
  },

  // Crear una nueva factura
  async create(facturaData) {
    try {
      const newFactura = {
        id: Date.now(),
        ...facturaData,
      };
      fakeApi.facturas?.push(newFactura); // Simulación
      console.log('✅ Factura creada correctamente:', newFactura);
      return newFactura;
    } catch (error) {
      console.error('❌ Error al crear factura:', error);
      throw error;
    }
  },

  // Actualizar una factura existente
  async update(id, updatedData) {
    try {
      const facturas = await fakeApi.getFacturas();
      const index = facturas.findIndex(f => f.id === id);
      if (index === -1) throw new Error('Factura no encontrada');

      const updated = { ...facturas[index], ...updatedData };
      facturas[index] = updated;

      console.log('🛠 Factura ${id} actualizada correctamente:', updated);
      return updated;
    } catch (error) {
      console.error('❌ Error al actualizar factura' + id + ':', error);
      throw error;
    }
  },

  // Eliminar una factura
  async remove(id) {
    try {
      const facturas = await fakeApi.getFacturas();
      const index = facturas.findIndex(f => f.id === id);
      if (index === -1) throw new Error('Factura no encontrada');

      const removed = facturas.splice(index, 1)[0];
      console.log('🗑 Factura eliminada correctamente:', removed);
      return removed;
    } catch (error) {
      console.error('❌ Error al eliminar factura:', error);
      throw error;
    }
  },
};