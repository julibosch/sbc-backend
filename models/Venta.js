import mongoose from "mongoose";
import { DateTime } from 'luxon';

const VentaSchema = mongoose.Schema({
  productos: 
  [
    {
    producto: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Producto',
      required: true
    },
    precioUnitario: {
      type: Number,
      required: true
    },
    cantidad: {
      type: Number,
      required: true
    }
  }
],
  precioTotal: {
    type: Number,
    required: true,
    trim: true
  },
  fecha: {
    type: String,
    default: () => new Date().toLocaleString('en-US', { timeZone: 'America/Buenos_Aires' })
  }
});

const Venta = mongoose.model('Venta', VentaSchema);

export default Venta;