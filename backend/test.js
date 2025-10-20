const clientesModel = require('./models/clientesModel');

// Generar un DNI aleatorio de 8 dígitos
const generarDni = () => Math.floor(10000000 + Math.random() * 90000000).toString();

const nuevoCliente = {
  nombre: 'Test',
  apellido: 'Usuario',
  dni: generarDni(),
  email: 'test@mail.com',
  telefono: '123456789'
};

clientesModel.createCliente(
  nuevoCliente.nombre,
  nuevoCliente.apellido,
  nuevoCliente.dni,
  nuevoCliente.email,
  nuevoCliente.telefono,
  (err, result) => {
    if (err) return console.error('Error en test:', err);
    console.log('Cliente creado correctamente con id:', result.id);
    console.log('DNI usado:', nuevoCliente.dni);
  }
); 