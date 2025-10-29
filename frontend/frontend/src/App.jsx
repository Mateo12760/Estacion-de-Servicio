import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, AppContext } from './context/AppContext';
import Login from './modules/auth/Login';
import Sidebar from './components/Sidebar';

const AppContent = () => {
  const { user, logout } = useContext(AppContext);

  if (!user) return <Login />;

  return (
    <div className="d-flex">
      <Sidebar onLogout={logout} />
      <div className="flex-grow-1 p-3">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
};

const App = () => (
  <AppProvider>
    <Router>
      <AppContent />
    </Router>
  </AppProvider>
);

export default App;