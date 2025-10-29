// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Middleware para validar el body en login
const validateLoginBody = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email y contraseña son requeridos.' });
  }
  next();
};

// Middleware para validar body en register
const validateRegisterBody = (req, res, next) => {
  const { nombre, email, password } = req.body;
  if (!nombre || !email || !password) {
    return res.status(400).json({ message: 'Nombre, email y contraseña son requeridos.' });
  }
  next();
};

// Rutas de autenticación
router.post('/login', validateLoginBody, authController.login);
router.post('/register', validateRegisterBody, authController.register);

module.exports = router;