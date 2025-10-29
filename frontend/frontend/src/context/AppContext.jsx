import React, { createContext, useState, useContext } from 'react';
import { fakeApi } from '../data/FakeData'; // Usamos el backend simulado

// Crear el contexto
const AppContext = createContext();

// Provider
export const AppProvider = ({ children }) => {
  // Estado de autenticación
  const [user, setUser] = useState(null); // usuario logeado
  const [token, setToken] = useState(null); // token simulado
  const [loading, setLoading] = useState(false); // indicador de carga

  // Función para logear
  const login = async (email, password) => {
    setLoading(true);
    try {
      const foundUser = fakeApi.usuarios.find(u => u.email === email && u.password === password);
      if (!foundUser) throw new Error('Usuario o contraseña incorrectos');

      // Guardar usuario y token simulado
      setUser(foundUser);
      setToken('fake-jwt-token'); 
      setLoading(false);
      return foundUser;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  // Función para deslogear
  const logout = () => {
    setUser(null);
    setToken(null);
  };

  return (
    <AppContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AppContext.Provider>
  );
};

// Hook para usar el contexto
export const useAppContext = () => useContext(AppContext); 