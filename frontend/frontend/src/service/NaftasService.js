// src/services/NaftasService.js
import { fakeApi } from '../data/FakeData.js';

export const NaftasService = {
  // Obtener todas las naftas
  async getAll() {
    try {
      const data = await fakeApi.getNaftas();
      console.log('⛽ Naftas obtenidas correctamente:', data);
      return data;
    } catch (error) {
      console.error('❌ Error al obtener naftas:', error);
      throw error;
    }
  },

  // Crear una nueva nafta
  async create(naftaData) {
    try {
      const newNafta = {
        id: Date.now(),
        ...naftaData,
      };
      fakeApi.naftas?.push(newNafta); // Simulación
      console.log('✅ Nafta creada correctamente:', newNafta);
      return newNafta;
    } catch (error) {
      console.error('❌ Error al crear nafta:', error);
      throw error;
    }
  },

  // Actualizar una nafta existente
  async update(id, updatedData) {
    try {
      const naftas = await fakeApi.getNaftas();
      const index = naftas.findIndex(n => n.id === id);
      if (index === -1) throw new Error('Nafta no encontrada');

      const updated = { ...naftas[index], ...updatedData };
      naftas[index] = updated;

      console.log('🛠 Nafta ${id} actualizada correctamente:', updated);
      return updated;
    } catch (error) {
      console.error('❌ Error al actualizar nafta' + id + ':', error);
      throw error;
    }
  },

  // Eliminar una nafta
  async remove(id) {
    try {
      const naftas = await fakeApi.getNaftas();
      const index = naftas.findIndex(n => n.id === id);
      if (index === -1) throw new Error('Nafta no encontrada');

      const removed = naftas.splice(index, 1)[0];
      console.log('🗑 Nafta eliminada correctamente:', removed);
      return removed;
    } catch (error) {
      console.error('❌ Error al eliminar nafta' + id + ':', error);
      throw error;
    }
  },
};