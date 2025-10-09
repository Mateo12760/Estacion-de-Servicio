import express from "express";
import cors from "cors";
import naftasRoutes from "./routes/naftas.js";
import ventasRoutes from "./routes/ventas.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/naftas", naftasRoutes);
app.use("/api/ventas", ventasRoutes);

app.listen(4000, () => console.log("Servidor corriendo en http://localhost:4000"));