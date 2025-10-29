
import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = ({ onLogout }) => {
  const menuItems = [
    { name: 'Dashboard', path: '/' },
    { name: 'Clientes', path: '/clientes' },
    { name: 'Facturas', path: '/facturas' },
    { name: 'Naftas', path: '/naftas' },
    { name: 'Recargas', path: '/recargas' },
    { name: 'Ventas', path: '/ventas' },
  ];

  return (
     <div className="d-flex flex-column vh-100 p-3 bg-dark text-white" style={{ width: '220px' }}>
      <h3 className="mb-4">Estación Servicio</h3>

      <ul className="nav nav-pills flex-column mb-auto">
        {menuItems.map((item) => (
          <li key={item.path} className="nav-item mb-1">
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                isActive ? 'nav-link active bg-primary text-white' : 'nav-link text-white'
              }
            >
              {item.name}
            </NavLink>
          </li>
        ))}
      </ul>

      <hr className="text-white" />

      <button className="btn btn-outline-light mt-auto w-100" onClick={onLogout}>
        Logout
      </button>
    </div>
  
  );
};

export default Sidebar;