import express from "express";
import { naftas } from "../data/naftas.js";
import { stockTotal } from "../data/naftas.js";

const router = express.Router();

// GET todas las naftas + stock total
router.get("/", (req, res) => {
  res.json({ naftas, stockTotal });
});

// PUT recargar stock global
router.put("/recargar", (req, res) => {
  const { litros } = req.body;
  if (litros <= 0) return res.status(400).json({ error: "Cantidad inválida" });

  // sumamos al stock global
  import("../data/naftas.js").then(module => {
    module.stockTotal += litros;
    res.json({ message: "Stock recargado", stockTotal: module.stockTotal });
  });
});

export default router;

