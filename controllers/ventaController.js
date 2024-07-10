import sanitize from "mongo-sanitize";
import Venta from "../models/Venta.js";

const listadoVentas = async (req, res) => {
  try {
    const ventas = await Venta.find({}).sort({ fecha: "asc" }).populate({
      path: "productos.producto",
      select: "descripcion",
    });

    return res.status(200).json(ventas);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const listadoVentasFinDeSemana = async (req, res) => {
  const range = sanitize(req.body.rangeFormateado);

  if (!range || !range.from || !range.to) {
    return res.status(400).json({ message: "Fechas vacias, debe completarlas" })
  }

  const fechaDesdeFormateada = `${range.from}, 00:00:01`
  const fechaHastaFormateada = `${range.to}, 23:59:59`

  try {
    const ventasAgrupadas = await Venta.aggregate([
      {
        $match: {
          fecha: { $gte: fechaDesdeFormateada, $lte: fechaHastaFormateada },
        },
      },
      {
        $unwind: "$productos",
      },
      {
        $group: {
          _id: "$productos.productoID",
          totalVentas: { $sum: "$productos.cantidad" },
        },
      },
      {
        $lookup: {
          from: "productos",
          localField: "_id",
          foreignField: "_id",
          as: "producto",
        },
      },
      {
        $unwind: "$producto",
      },
      {
        $project: {
          _id: 0,
          productoID: "$_id",
          descripcion: "$producto.descripcion",
          categoria: "$producto.categoria",
          totalVentas: 1,
        },
      },
      {
        $sort: { totalVentas: -1 },
      },
    ]);

    return res.status(200).json(ventasAgrupadas);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const registrarVenta = async (req, res) => {
  const { productos, precioTotal } = req.body;
  let productosSanitizado = sanitize(productos);
  const precioSanitizado = sanitize(precioTotal);

  // Filtrar los productos para quitar la descripción
  productosSanitizado = productos.map(({ _id, precioUnitario, cantidad, categoria }) => ({
    productoID: _id,
    precioUnitario,
    cantidad,
    categoria
  }));

  // Validar que se proporcionen los campos requeridos
  if (
    !precioSanitizado ||
    !productosSanitizado.length ||
    !productosSanitizado.every(
      (producto) =>
        producto.productoID && producto.precioUnitario && producto.cantidad && producto.categoria
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
