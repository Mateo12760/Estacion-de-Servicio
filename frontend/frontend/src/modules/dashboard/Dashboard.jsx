// src/modules/Dashboard/Dashboard.jsx
import React from 'react';
import { naftas, clientes, ventas } from '../../data/FakeData';

const Dashboard = () => {
  const totalClientes = clientes.length;
  const totalVentas = ventas.reduce((sum, v) => sum + v.monto, 0);
  const totalNaftas = naftas.reduce((sum, n) => sum + n.stock_litros, 0);

  return (
    <div className="container mt-4">
      <h2>Bienvenido al Dashboard</h2>

      <div className="row my-4">
        <div className="col-md-4">
          <div className="card text-white bg-primary mb-3">
            <div className="card-body">
              <h5 className="card-title">Clientes</h5>
              <p className="card-text">{totalClientes}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-white bg-success mb-3">
            <div className="card-body">
              <h5 className="card-title">Total Ventas</h5>
              <p className="card-text">${totalVentas}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-white bg-warning mb-3">
            <div className="card-body">
              <h5 className="card-title">Stock Naftas</h5>
              <p className="card-text">{totalNaftas} litros</p>
            </div>
          </div>
        </div>
      </div>

      <h5>Últimas ventas</h5>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nafta</th>
            <th>Litros</th>
            <th>Monto</th>
          </tr>
        </thead>
        <tbody>
          {ventas.slice(-5).map(v => {
            const nafta = naftas.find(n => n.id === v.nafta_id);
            return (
              <tr key={v.id}>
                <td>{v.id}</td>
                <td>{nafta?.nombre || 'Desconocido'}</td>
                <td>{v.litros}</td>
                <td>${v.monto}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;