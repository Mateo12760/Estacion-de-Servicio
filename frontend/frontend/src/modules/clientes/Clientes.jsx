// src/modules/Clientes/Clientes.jsx
import React, { useState, useEffect } from 'react';
import Table from '../../components/Table';
import Modal from '../../components/Modal';
import { fakeApi } from '../../data/FakeData';

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState(null);

  // Cargar clientes al montar
  useEffect(() => {
    fakeApi.getClientes().then(setClientes);
  }, []);

  // Abrir modal para crear nuevo cliente
  const handleAdd = () => {
    setSelectedCliente(null);
    setShowModal(true);
  };

  // Abrir modal para editar cliente
  const handleEdit = (cliente) => {
    setSelectedCliente(cliente);
    setShowModal(true);
  };

  // Eliminar cliente
  const handleDelete = async (id) => {
    try {
      await fakeApi.deleteCliente(id);
      setClientes(clientes.filter(c => c.id !== id));
    } catch (error) {
      console.error('Error al eliminar cliente ' + id + ':', error);
    }
  };

  // Crear o actualizar cliente
  const handleSubmit = async (data) => {
    if (selectedCliente) {
      // Editar
      const updated = await fakeApi.updateCliente(selectedCliente.id, data);
      setClientes(clientes.map(c => (c.id === updated.id ? updated : c)));
    } else {
      // Crear
      const newCliente = await fakeApi.createCliente(data);
      setClientes([...clientes, newCliente]);
    }
    setShowModal(false);
  };

  return (
    <div className="p-3">
      <h2>Clientes</h2>
      <button className="btn btn-primary mb-3" onClick={handleAdd}>
        Nuevo Cliente
      </button>

      <Table
        data={clientes}
        onEdit={handleEdit}
        onDelete={handleDelete}
        columns={['nombre', 'apellido', 'dni', 'email', 'telefono']}
      />

      {showModal && (
        <Modal
          title={selectedCliente ? 'Editar Cliente' : 'Nuevo Cliente'}
          data={selectedCliente}
          onClose={() => setShowModal(false)}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
};

export default Clientes;
