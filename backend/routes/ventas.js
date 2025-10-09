import express from "express";
import { naftas, ventas } from "../data/naftas.js";
import * as data from "../data/naftas.js"; 

const router = express.Router();
let nextId = 1;

// GET todas las ventas
router.get("/", (req, res) => {
  res.json({ ventas, stockTotal: data.stockTotal });
});

// POST nueva venta
router.post("/", (req, res) => {
  const { naftaId, monto, tipoFactura } = req.body;
  const nafta = naftas.find(n => n.id === naftaId);
  if (!nafta) return res.status(404).json({ error: "Nafta no encontrada" });

  const litrosVendidos = monto / nafta.precioLitro;
  if (litrosVendidos > data.stockTotal)
    return res.status(400).json({ error: "Stock insuficiente" });

  data.stockTotal -= litrosVendidos;

  const venta = {
    id: nextId++,
    tipoNafta: nafta.nombre,
    litrosVendidos,
    monto,
    tipoFactura,
    fecha: new Date(),
  };
  ventas.push(venta);
  res.json({ venta, stockTotal: data.stockTotal });
});

// PUT actualizar venta
router.put("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { naftaId, monto, tipoFactura } = req.body;
  const venta = ventas.find(v => v.id === id);
  if (!venta) return res.status(404).json({ error: "Venta no encontrada" });

  // Devolvemos los litros antiguos al stock
  data.stockTotal += venta.litrosVendidos;

  const naftaNew = naftas.find(n => n.id === naftaId);
  if (!naftaNew) return res.status(404).json({ error: "Nafta nueva no encontrada" });

  const nuevosLitros = monto / naftaNew.precioLitro;
  if (nuevosLitros > data.stockTotal)
    return res.status(400).json({ error: "Stock insuficiente" });

  data.stockTotal -= nuevosLitros;

  // Actualizamos venta
  venta.tipoNafta = naftaNew.nombre;
  venta.litrosVendidos = nuevosLitros;
  venta.monto = monto;
  venta.tipoFactura = tipoFactura;
  venta.fecha = new Date();

  res.json({ venta, stockTotal: data.stockTotal });
});

// DELETE venta
router.delete("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = ventas.findIndex(v => v.id === id);
  if (index === -1) return res.status(404).json({ error: "Venta no encontrada" });

  const ventaEliminada = ventas[index];
  data.stockTotal += ventaEliminada.litrosVendidos;

  ventas.splice(index, 1);
  res.json({ message: "Venta eliminada", stockTotal: data.stockTotal });
});

export default router;