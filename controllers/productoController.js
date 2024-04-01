import {
  sanitizarDatosProductos,
  validarCamposProductos,
} from "../libs/funciones.js";
import Producto from "../models/Producto.js";

const listadoProductos = async (req, res) => {
  try {
    const productos = await Producto.find({}).sort({
      categoria: "asc",
    });;
    return res.status(200).json(productos);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const crearProducto = async (req, res) => {
  const { descripcion, precio, categoria } = req.body;

  let precioParseado = isNaN(precio) ? null : Number(precio);
  // Valida los campos del producto
  const error = validarCamposProductos(descripcion, precioParseado, categoria);
  if (error) {
    return res.status(400).json({ message: error });
  }

  const camposSanitizados = sanitizarDatosProductos(
    descripcion,
    precio,
    categoria
  );
  const { descripcionSanitizada, precioSanitizado, categoriaSanitizada } =
    camposSanitizados;

  const nuevoProducto = new Producto({
    descripcion: descripcionSanitizada,
    precio: precioSanitizado,
    categoria: categoriaSanitizada,
  });
  try {
    const productoCreado = await nuevoProducto.save();
    return res
      .status(201)
      .json({ productoCreado, message: "Producto creado exitosamente!" });
  } catch (error) {
    if (
      error.message.includes(
        "E11000 duplicate key error collection: sbc.productos index: descripcion"
      )
    ) {
      return res
        .status(409)
        .json({ message: "Ya existe una Descripción igual" });
    }

    return res.status(400).json({ message: error.message });
  }
};

const editarProducto = async (req, res) => {
  const { descripcion, precio, categoria } = req.body;

  // Valida los campos del producto
  const error = validarCamposProductos(descripcion, precio, categoria);
  if (error) {
    return res.status(400).json({ message: error });
  }

  const camposSanitizados = sanitizarDatosProductos( descripcion, precio, categoria );
  const { descripcionSanitizada, precioSanitizado, categoriaSanitizada } = camposSanitizados;

  try {
    const productoEditado = await Producto.findByIdAndUpdate(
      req.params._id,
      {
        descripcion: descripcionSanitizada,
        precio: precioSanitizado,
        categoria: categoriaSanitizada,
      },
      { new: true }
    );
    return res
      .status(200)
      .json({ productoEditado, message: "Producto editado exitosamente" });
  } catch (error) {
    if (
      error.message.includes(
        "E11000 duplicate key error collection: sbc.productos index: descripcion"
      )
    ) {
      return res
        .status(409)
        .json({ message: "Ya existe una Descripción igual" });
    }

    return res.status(400).json({ message: error.message });
  }
};

const eliminarProducto = async (req, res) => {
  const { _id } = req.params;
  try {
    const productoEliminado = await Producto.findByIdAndDelete({ _id });

    if (!productoEliminado) {
      return res.status(400).json({ message: "No se encontró el Producto" });
    }

    //! Falta validar que se fije si el producto esta registrado en una venta.
    return res.status(200).json({ message: "Producto eliminado exitosamente" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const obtenerProducto = async (req, res) => {
  console.log(req.body);
};

export {
  listadoProductos,
  crearProducto,
  editarProducto,
  eliminarProducto,
  obtenerProducto,
};
