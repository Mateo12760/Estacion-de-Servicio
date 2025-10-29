// db.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error('❌ Error al conectar:', err.message);
  else console.log('✅ Conectado a SQLite.');
});

db.serialize(() => {
  db.run("PRAGMA foreign_keys = ON;");

  // 🛢 TABLA NAFTAS
  db.run(`
    CREATE TABLE IF NOT EXISTS naftas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      precio_por_litro NUMERIC(10,2) NOT NULL,
      stock_litros REAL NOT NULL DEFAULT 0
    )
  `);

  // 👥 TABLA CLIENTES
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

  // 🧾 TABLA FACTURAS
  db.run(`
    CREATE TABLE IF NOT EXISTS facturas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tipo TEXT CHECK(tipo IN ('B','C')) NOT NULL DEFAULT 'B',
      fecha DATETIME DEFAULT (datetime('now')),
      cliente_id INTEGER,
      total NUMERIC(10,2) NOT NULL,
      FOREIGN KEY(cliente_id) REFERENCES clientes(id)
    )
  `);

  // 💸 TABLA VENTAS
  db.run(`
    CREATE TABLE IF NOT EXISTS ventas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nafta_id INTEGER NOT NULL,
      factura_id INTEGER,
      litros REAL NOT NULL,
      monto NUMERIC(10,2) NOT NULL,
      empleado TEXT DEFAULT 'Desconocido',
      fecha DATETIME DEFAULT (datetime('now')),
      FOREIGN KEY(nafta_id) REFERENCES naftas(id),
      FOREIGN KEY(factura_id) REFERENCES facturas(id)
    )
  `);

  // 🚚 TABLA RECARGAS
  db.run(`
    CREATE TABLE IF NOT EXISTS recargas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nafta_id INTEGER NOT NULL,
      litros REAL NOT NULL,
      empleado TEXT DEFAULT 'Desconocido',
      fecha DATETIME DEFAULT (datetime('now')),
      FOREIGN KEY(nafta_id) REFERENCES naftas(id)
    )
  `);

  // 📊 TABLA MOVIMIENTOS DE STOCK
  db.run(`
    CREATE TABLE IF NOT EXISTS movimientos_stock (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nafta_id INTEGER NOT NULL,
      tipo TEXT CHECK(tipo IN ('venta','recarga')) NOT NULL,
      litros REAL NOT NULL,
      referencia_id INTEGER,
      fecha DATETIME DEFAULT (datetime('now')),
      FOREIGN KEY(nafta_id) REFERENCES naftas(id)
    )
  `);

  // ⚙ TRIGGER: actualizar stock al insertar venta
  db.run(`
    CREATE TRIGGER IF NOT EXISTS trg_descuento_stock_venta
    AFTER INSERT ON ventas
    FOR EACH ROW
    BEGIN
      UPDATE naftas
      SET stock_litros = stock_litros - NEW.litros
      WHERE id = NEW.nafta_id;

      INSERT INTO movimientos_stock (nafta_id, tipo, litros, referencia_id)
      VALUES (NEW.nafta_id, 'venta', -NEW.litros, NEW.id);
    END;
  `);

  // ⚙ TRIGGER: actualizar stock al insertar recarga
  db.run(`
    CREATE TRIGGER IF NOT EXISTS trg_actualizar_stock_recarga
    AFTER INSERT ON recargas
    FOR EACH ROW
    BEGIN
      UPDATE naftas
      SET stock_litros = stock_litros + NEW.litros
      WHERE id = NEW.nafta_id;

      INSERT INTO movimientos_stock (nafta_id, tipo, litros, referencia_id)
      VALUES (NEW.nafta_id, 'recarga', NEW.litros, NEW.id);
    END;
  `);

  // ⚙ TRIGGER: crear factura automática al registrar una venta sin factura
  db.run(`
    CREATE TRIGGER IF NOT EXISTS trg_factura_automatica
    AFTER INSERT ON ventas
    WHEN NEW.factura_id IS NULL
    BEGIN
      INSERT INTO facturas (tipo, total)
      VALUES ('B', NEW.monto);

      UPDATE ventas
      SET factura_id = (SELECT last_insert_rowid())
      WHERE id = NEW.id;
    END;
  `);

  console.log('🛠 Tablas y triggers creados correctamente.');

  // 🧩 DATOS INICIALES
  db.get("SELECT COUNT(*) as count FROM naftas", (err, row) => {
    if (err) return console.error('❌ Error al contar naftas:', err.message);

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