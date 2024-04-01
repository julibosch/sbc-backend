import express from "express";
import { listadoProductos, crearProducto, editarProducto, eliminarProducto, obtenerProducto } from "../controllers/productoController.js";

const router = express.Router();

router.get("/admin/productos", listadoProductos);
router.post("/admin/productos", crearProducto);
router.put("/admin/productos/:_id", editarProducto);
router.delete("/admin/productos/:_id", eliminarProducto);
router.get("/admin/productos/:_id", obtenerProducto);

export default router;