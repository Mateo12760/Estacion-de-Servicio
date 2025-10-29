// src/services/ClientesService.js
import { fakeApi } from '../data/FakeData.js';

export const ClientesService = {
  // Obtener todos los clientes
  async getAll() {
    try {
      return await fakeApi.getClientes();
    } catch (error) {
      console.error('Error al obtener clientes:', error);
      throw error;
    }
  },

  // Obtener cliente por ID
  async getById(id) {
    try {
      const clientes = await fakeApi.getClientes();
      const cliente = clientes.find(c => c.id === id);
      if (!cliente) throw new Error('Cliente no encontrado');
      return cliente;
    } catch (error) {
      console.error('Error al obtener cliente' + id +':', error);
      throw error;
    }
  },

  // Crear un nuevo cliente
  async create(data) {
    try {
      if (!data.nombre || !data.dni) throw new Error('Faltan datos requeridos');
      const nuevoCliente = await fakeApi.createCliente(data);
      console.log('✅ Cliente creado:', nuevoCliente);
      return nuevoCliente;
    } catch (error) {
      console.error('Error al crear cliente:', error);
      throw error;
    }
  },

  // Actualizar cliente
  async update(id, data) {
    try {
      const actualizado = await fakeApi.updateCliente(id, data);
      console.log('📝 Cliente actualizado:', actualizado);
      return actualizado;
    } catch (error) {
      console.error('Error al actualizar cliente' + id + ':', error);
      throw error;
    }
  },

  // Eliminar cliente
  async remove(id) {
    try {
      const eliminado = await fakeApi.deleteCliente(id);
      console.log('🗑 Cliente eliminado:', eliminado);
      return eliminado;
    } catch (error) {
      console.error('Error al eliminar cliente' + id + ':', error);
      throw error;
    }
  },
};