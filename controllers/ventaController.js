import sanitize from "mongo-sanitize";
import Venta from "../models/Venta.js";

const listadoVentas = async (req, res) => {
  try {
const ventas = await Venta.find({})
  .sort({ fecha: 'asc' })
  .populate({
    path: 'productos.producto',
    select: 'descripcion categoria'
  });

    return res.status(200).json(ventas);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

const registrarVenta = async (req, res) => {
  const { productos, precioTotal } = req.body;
  const productosSanitizado = sanitize(productos);
  const precioSanitizado = sanitize(precioTotal);
  
  if (!precioTotal || !productosSanitizado.length || !productosSanitizado.every(producto => producto.producto && producto.precioUnitario && producto.cantidad)) {
    return res.status(400).json({ message: "Campos incompletos en la venta, no se pudo registrar." });
  }

  const nuevaVenta = new Venta({ productos: productosSanitizado, precioTotal: precioSanitizado });
  try {
    const ventaRegistrada = await nuevaVenta.save();
    return res.status(200).json({ ventaRegistrada, message: "Venta registrada exitosamente" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

export {
  listadoVentas,
  registrarVenta
}