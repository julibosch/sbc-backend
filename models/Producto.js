import mongoose from "mongoose";

const ProductoSchema = mongoose.Schema({
  descripcion: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  precio: {
    type: Number,
    required: true,
    trim: true
  },
  categoria: {
    type: String,
    required: true,
    trim: true
  },
});

const Producto = mongoose.model("Producto", ProductoSchema);

export default Producto;