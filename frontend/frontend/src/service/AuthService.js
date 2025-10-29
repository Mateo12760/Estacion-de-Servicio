// src/services/AuthService.js
import { usuarios } from '../data/FakeData.js';

export const AuthService = {
  login: async (email, password) => {
    try {
      const user = usuarios.find(u => u.email === email && u.password === password && u.is_active);
      if (!user) throw new Error('Usuario o contraseña incorrecta');
      // Retornamos solo los datos necesarios, sin password
      const { password: _, ...userData } = user;
      return Promise.resolve(userData);
    } catch (error) {
      console.error('Error en login:', error);
      return Promise.reject(error);
    }
  },

  logout: async () => {
    try {
      // Para el prototipo, logout solo resetea el estado
      return Promise.resolve(true);
    } catch (error) {
      console.error('Error en logout:', error);
      return Promise.reject(error);
    }
  }
};