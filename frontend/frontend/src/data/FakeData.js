// src/data/fakeData.js

// Naftas
export const naftas = [
  { id: 1, nombre: 'Nafta Súper', precio_por_litro: 1326, stock_litros: 500 },
  { id: 2, nombre: 'Infinia Nafta', precio_por_litro: 1568, stock_litros: 500 },
  { id: 3, nombre: 'Diesel 500', precio_por_litro: 1311, stock_litros: 500 },
  { id: 4, nombre: 'Infinia Diesel', precio_por_litro: 1512, stock_litros: 500 },
];

// Clientes
export const clientes = [
  { id: 1, nombre: 'Juan', apellido: 'Pérez', dni: '12345678', email: 'juan@gmail.com', telefono: '1122334455' },
  { id: 2, nombre: 'María', apellido: 'Gómez', dni: '87654321', email: 'maria@gmail.com', telefono: '5544332211' },
  { id: 3, nombre: 'Carlos', apellido: 'López', dni: '11223344', email: 'carlos@gmail.com', telefono: '6677889900' },
];

// Usuarios (auth)
export const usuarios = [
  { id: 1, nombre: 'admin', email: 'admin@gmail.com', password: 'admin123', rol: 'admin', is_active: true },
  { id: 2, nombre: 'empleado', email: 'empleado@gmail.com', password: 'empleado123', rol: 'empleado', is_active: true },
];

// Facturas
export const facturas = [
  { id: 1, tipo: 'B', fecha: '2025-10-23T10:00:00', cliente_id: 1, total: 5000 },
  { id: 2, tipo: 'C', fecha: '2025-10-23T11:00:00', cliente_id: 2, total: 3200 },
];

// Ventas
export const ventas = [
  { id: 1, nafta_id: 1, factura_id: 1, litros: 30, monto: 39780, fecha: '2025-10-23T10:05:00' },
  { id: 2, nafta_id: 2, factura_id: 1, litros: 20, monto: 31360, fecha: '2025-10-23T10:10:00' },
  { id: 3, nafta_id: 3, factura_id: 2, litros: 25, monto: 32775, fecha: '2025-10-23T11:05:00' },
];

// Recargas (stock de nafta)
export const recargas = [
  { id: 1, nafta_id: 1, litros: 500, fecha: '2025-10-22T08:00:00' },
  { id: 2, nafta_id: 2, litros: 500, fecha: '2025-10-22T08:10:00' },
  { id: 3, nafta_id: 3, litros: 500, fecha: '2025-10-22T08:20:00' },
  { id: 4, nafta_id: 4, litros: 500, fecha: '2025-10-22T08:30:00' },
];

// Funciones simuladas de servicio
export const fakeApi = {
  getClientes: () => Promise.resolve([...clientes]),
  getNaftas: () => Promise.resolve([...naftas]),
  getFacturas: () => Promise.resolve([...facturas]),
  getVentas: () => Promise.resolve([...ventas]),
  getRecargas: () => Promise.resolve([...recargas]),

  createCliente: (data) => {
    const newCliente = { id: clientes.length + 1, ...data };
    clientes.push(newCliente);
    return Promise.resolve(newCliente);
  },

  updateCliente: (id, data) => {
    const index = clientes.findIndex(c => c.id === id);
    if (index === -1) return Promise.reject(new Error('Cliente no encontrado'));
    clientes[index] = { ...clientes[index], ...data };
    return Promise.resolve(clientes[index]);
  },

  deleteCliente: (id) => {
    const index = clientes.findIndex(c => c.id === id);
    if (index === -1) return Promise.reject(new Error('Cliente no encontrado'));
    const removed = clientes.splice(index, 1)[0];
    return Promise.resolve(removed);
  },
};