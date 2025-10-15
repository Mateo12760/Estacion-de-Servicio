const express = require("express");
const cors = require("cors");

// Importar rutas
const naftasRoutes = require("./routes/naftasRoutes");
const ventasRoutes = require("./routes/ventasRoutes");
const recargasRoutes = require("./routes/recargasRoutes");
const facturasRoutes = require("./routes/facturasRoutes");
const clientesRoutes = require("./routes/clientesRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Rutas
app.use("/api/naftas", naftasRoutes);
app.use("/api/ventas", ventasRoutes);
app.use("/api/recargas", recargasRoutes);
app.use("/api/facturas", facturasRoutes);
app.use("/api/clientes", clientesRoutes);

// Servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log("✅ Servidor corriendo en http://localhost:" + PORT);
});