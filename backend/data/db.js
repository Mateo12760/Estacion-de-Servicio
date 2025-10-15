// db.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Ruta al archivo de base de datos
const dbPath = path.resolve(__dirname, 'database.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error('❌ Error al conectar:', err.message);
  else console.log('✅ Conectado a SQLite.');
});

db.serialize(() => {
  // Activar soporte de claves foráneas
  db.run("PRAGMA foreign_keys = ON;");

  // TABLA NAFTAS
  db.run(`
    CREATE TABLE IF NOT EXISTS naftas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      precio_por_litro REAL NOT NULL,
      stock_litros REAL NOT NULL
    )
  `);

  // TABLA CLIENTES
  db.run(`
    CREATE TABLE IF NOT EXISTS clientes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      apellido TEXT,
      dni TEXT UNIQUE,
      email TEXT,
      telefono TEXT
    )
  `);

  // TABLA FACTURAS
  db.run(`
    CREATE TABLE IF NOT EXISTS facturas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tipo TEXT CHECK(tipo IN ('B','C')) NOT NULL,
      fecha TEXT DEFAULT (datetime('now')),
      cliente_id INTEGER,
      total REAL NOT NULL,
      FOREIGN KEY(cliente_id) REFERENCES clientes(id)
    )
  `);

  // TABLA VENTAS
  db.run(`
    CREATE TABLE IF NOT EXISTS ventas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nafta_id INTEGER NOT NULL,
      factura_id INTEGER, -- permite NULL inicialmente
      litros REAL NOT NULL,
      monto REAL NOT NULL,
      fecha TEXT DEFAULT (datetime('now')),
      FOREIGN KEY(nafta_id) REFERENCES naftas(id),
      FOREIGN KEY(factura_id) REFERENCES facturas(id)
    )
  `);

  // TABLA RECARGAS
  db.run(`
    CREATE TABLE IF NOT EXISTS recargas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nafta_id INTEGER NOT NULL,
      litros REAL NOT NULL,
      fecha TEXT DEFAULT (datetime('now')),
      FOREIGN KEY(nafta_id) REFERENCES naftas(id)
    )
  `);

  console.log('🛠 Tablas creadas correctamente.');

  // Insertar datos iniciales en naftas si no existen
  db.get("SELECT COUNT(*) as count FROM naftas", (err, row) => {
    if (err) {
      console.error('❌ Error al contar naftas:', err.message);
      return;
    }
    if (row.count === 0) {
      const naftasIniciales = [
        ['Nafta Súper', 1326, 500],
        ['Infinia Nafta', 1568, 500],
        ['Diesel 500', 1311, 500],
        ['Infinia Diesel', 1512, 500],
      ];
      const stmt = db.prepare('INSERT INTO naftas (nombre, precio_por_litro, stock_litros) VALUES (?, ?, ?)');
      naftasIniciales.forEach(([nombre, precio, stock]) => stmt.run(nombre, precio, stock));
      stmt.finalize(() => console.log('⛽ Naftas iniciales cargadas.'));
    }
  });
});

module.exports = { db };