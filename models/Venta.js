import mongoose from "mongoose";
import { format } from 'date-fns';

const VentaSchema = mongoose.Schema({
  productos: [
    {
      productoID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Producto",
        required: true,
      },
      precioUnitario: {
        type: Number,
        required: true,
      },
      cantidad: {
        type: Number,
        required: true,
      },
      categoria: {
        type: String,
        required: true,
      },
    },
  ],
  precioTotal: {
    type: Number,
    required: true,
    trim: true,
  },
  fecha: {
    type: String,
    default: () => format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
  },
});

const Venta = mongoose.model("Venta", VentaSchema);

export default Venta;
