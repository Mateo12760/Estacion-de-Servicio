import React, { useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { fakeApi } from '../../data/FakeData';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { login } = useContext(AppContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();

    // Buscar usuario en FakeData
    const usuario = fakeApi.usuarios.find(
      (u) => u.email === email && u.password === password
    );

    if (usuario) {
      login(usuario);          // 🔹 Actualiza AppContext
      setError('');
      navigate('/');           // 🔹 Redirige al dashboard
    } else {
      setError('Usuario o contraseña incorrecta');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <form
        onSubmit={handleLogin}
        className="p-4 bg-white shadow rounded"
        style={{ minWidth: '300px' }}
      >
        <h3 className="mb-3 text-center">Iniciar Sesión</h3>

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            id="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">Contraseña</label>
          <input
            type="password"
            id="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">Login</button>
      </form>
    </div>
  );
};

export default Login;