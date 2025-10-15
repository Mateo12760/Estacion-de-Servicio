const { db } = require('../data/db');

// Listar todas las recargas
const getAllRecargas = (callback) => {
    db.all(`
        SELECT r.id, n.nombre AS nafta, r.litros, r.fecha
        FROM recargas r
        JOIN naftas n ON r.nafta_id = n.id
    `, callback);
};

// Obtener recarga por ID
const getRecargaById = (id, callback) => {
    db.get(`
        SELECT r.id, n.nombre AS nafta, r.litros, r.fecha
        FROM recargas r
        JOIN naftas n ON r.nafta_id = n.id
        WHERE r.id=?
    `, [id], callback);
};

// Crear nueva recarga y devolver el ID generado
const createRecarga = (nafta_id, litros, callback) => {
    db.run(
        "INSERT INTO recargas (nafta_id, litros, fecha) VALUES (?, ?, datetime('now'))",
        [nafta_id, litros],
        function (err) {
            callback(err, this?.lastID); // devuelve el id de la recarga creada
        }
    );
};

module.exports = {
    getAllRecargas,
    getRecargaById,
    createRecarga
};