// src/services/RecargasService.js
import { fakeApi } from '../data/FakeData.js';

export const RecargasService = {
  // Obtener todas las recargas
  async getAll() {
    try {
      const data = await fakeApi.getRecargas();
      console.log('🔋 Recargas obtenidas correctamente:', data);
      return data;
    } catch (error) {
      console.error('❌ Error al obtener recargas:', error);
      throw error;
    }
  },

  // Crear una nueva recarga
  async create(recargaData) {
    try {
      const newRecarga = {
        id: Date.now(),
        ...recargaData,
        fecha: new Date().toISOString(),
      };
      fakeApi.recargas?.push(newRecarga); // Simulación local
      console.log('✅ Recarga creada correctamente:', newRecarga);
      return newRecarga;
    } catch (error) {
      console.error('❌ Error al crear recarga:', error);
      throw error;
    }
  },

  // Eliminar una recarga
  async remove(id) {
    try {
      const recargas = await fakeApi.getRecargas();
      const index = recargas.findIndex(r => r.id === id);
      if (index === -1) throw new Error('Recarga no encontrada');

      const removed = recargas.splice(index, 1)[0];
      console.log('🗑 Recarga eliminada correctamente:', removed);
      return removed;
    } catch (error) {
      console.error('❌ Error al eliminar recarga:', error);
      throw error;
    }
  },
};