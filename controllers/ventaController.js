import sanitize from "mongo-sanitize";
import Venta from "../models/Venta.js";

const listadoVentas = async (req, res) => {
  try {
    const ventas = await Venta.find({}).sort({ fecha: "asc" }).populate({
      path: "productos.producto",
      select: "descripcion categoria",
    });

    return res.status(200).json(ventas);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const listadoVentasFinDeSemana = async (req, res) => {
  const fechaDesde = sanitize(req.body.fechaDesde);
  const fechaHasta = sanitize(req.body.fechaHasta);

  if (fechaDesde == "" || fechaHasta == "")
    return res
      .status(400)
      .json({ message: "Fechas vacias, debe completarlas" });

  try {
    const ventas = await Venta.find({
      fecha: { $gte: fechaDesde, $lte: fechaHasta },
    })
      .sort({ fecha: "asc" })
      .populate({
        path: "productos.productoID",
        select: "descripcion categoria",
      });

    return res.status(200).json(ventas);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const registrarVenta = async (req, res) => {
  const { productos, precioTotal } = req.body;
  let productosSanitizado = sanitize(productos);
  const precioSanitizado = sanitize(precioTotal);

  // Filtrar los productos para quitar la descripción
  productosSanitizado = productos.map(({ _id, precioUnitario, cantidad }) => ({
    productoID: _id,
    precioUnitario,
    cantidad,
  }));

  // Validar que se proporcionen los campos requeridos
  if (
    !precioSanitizado ||
    !productosSanitizado.length ||
    !productosSanitizado.every(
      (producto) =>
        producto.productoID && producto.precioUnitario && producto.cantidad
    )
  ) {
    return res.status(400).json({
      message: "Campos incompletos en la venta, no se pudo registrar.",
    });
  }

  const nuevaVenta = new Venta({
    productos: productosSanitizado,
    precioTotal: precioSanitizado,
  });

  try {
    await nuevaVenta.save();
    return res.status(200).json({
      message: "Venta registrada exitosamente",
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export { listadoVentas, listadoVentasFinDeSemana, registrarVenta };
