import express from "express";
import { listadoVentas, listadoVentasFinDeSemana, registrarVenta } from "../controllers/ventaController.js";

const router = express.Router();

router.get("/admin/ventas", listadoVentas);
router.post("/admin/consultar-ventas-fechas", listadoVentasFinDeSemana);
router.post("/admin/ventas", registrarVenta);

export default router;