// src/services/VentasService.js
import { fakeApi } from '../data/FakeData.js';

export const VentasService = {
  // Obtener todas las ventas
  async getAll() {
    try {
      const data = await fakeApi.getVentas();
      console.log('🧾 Ventas obtenidas correctamente:', data);
      return data;
    } catch (error) {
      console.error('❌ Error al obtener ventas:', error);
      throw error;
    }
  },

  // Crear una nueva venta
  async create(ventaData) {
    try {
      const newVenta = {
        id: Date.now(),
        ...ventaData,
        fecha: new Date().toISOString(),
      };
      fakeApi.ventas?.push(newVenta); // Simulación local
      console.log('✅ Venta creada correctamente:', newVenta);
      return newVenta;
    } catch (error) {
      console.error('❌ Error al crear venta:', error);
      throw error;
    }
  },

  // Obtener ventas por factura
  async getByFactura(facturaId) {
    try {
      const ventas = await fakeApi.getVentas();
      const result = ventas.filter(v => v.factura_id === facturaId);
      console.log('📄 Ventas encontradas para factura' + facturaId + ':', result);
      return result;
    } catch (error) {
      console.error('❌ Error al obtener ventas por factura:', error);
      throw error;
    }
  },

  // Eliminar una venta
  async remove(id) {
    try {
      const ventas = await fakeApi.getVentas();
      const index = ventas.findIndex(v => v.id === id);
      if (index === -1) throw new Error('Venta no encontrada');

      const removed = ventas.splice(index, 1)[0];
      console.log('🗑 Venta eliminada correctamente:', removed);
      return removed;
    } catch (error) {
      console.error('❌ Error al eliminar venta:', error);
      throw error;
    }
  },
};