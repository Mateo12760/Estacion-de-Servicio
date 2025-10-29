import React from 'react';

const Navbar = ({ user }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light px-4">
      <span className="navbar-brand mb-0 h1">Estación de Servicio</span>

      <div className="ms-auto d-flex align-items-center">
        {user ? (
          <>
            <span className="me-3">Hola, {user.nombre || 'Usuario'}</span>
            {/* Aquí podrías agregar un botón de perfil o acciones rápidas si querés */}
          </>
        ) : (
          <span className="text-muted">No logeado</span>
        )}
      </div>
    </nav>
  );
};

export default Navbar;