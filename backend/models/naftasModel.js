const { db } = require('../data/db');

// Listar todas las naftas
const getAllNaftas = (callback) => {
    db.all("SELECT * FROM naftas", callback);
};

// Obtener nafta por id
const getNaftaById = (id, callback) => {
    db.get("SELECT * FROM naftas WHERE id = ?", [id], callback);
};

// Crear nueva nafta
const createNafta = (nombre, precio_por_litro, stock_litros, callback) => {
    if (
        typeof nombre !== 'string' || !nombre.trim() ||
        typeof precio_por_litro !== 'number' || precio_por_litro <= 0 ||
        typeof stock_litros !== 'number' || stock_litros < 0
    ) {
        return callback(new Error('Datos inválidos al crear la nafta'));
    }

    db.run(
        "INSERT INTO naftas (nombre, precio_por_litro, stock_litros) VALUES (?, ?, ?)",
        [nombre.trim(), precio_por_litro, stock_litros],
        callback
    );
};

// Actualizar nafta completa
const updateNafta = (id, nombre, precio_por_litro, callback) => {
    if (
        typeof nombre !== 'string' || !nombre.trim() ||
        typeof precio_por_litro !== 'number' || precio_por_litro <= 0 
        
    ) {
        return callback(new Error('Datos inválidos al actualizar la nafta'));
    }

    db.run(
        "UPDATE naftas SET nombre=?, precio_por_litro=?, stock_litros=? WHERE id=?",
        [nombre.trim(), precio_por_litro, stock_litros, id],
        callback
    );
};

// 🔥 Nuevo método: actualizar solo el precio
const updateNaftaPrice = (id, nuevoPrecio, callback) => {
    if (typeof nuevoPrecio !== 'number' || nuevoPrecio <= 0) {
        return callback(new Error('Precio inválido'));
    }

    db.run(
        "UPDATE naftas SET precio_por_litro=? WHERE id=?",
        [nuevoPrecio, id],
        callback
    );
};

// Eliminar nafta
const deleteNafta = (id, callback) => {
    db.run("DELETE FROM naftas WHERE id=?", [id], callback);
};

module.exports = {
    getAllNaftas,
    getNaftaById,
    createNafta,
    updateNafta,
    updateNaftaPrice, // 👈 agregado
    deleteNafta
};