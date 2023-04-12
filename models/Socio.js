import mongoose from "mongoose";

const socioSchema = mongoose.Schema({
  codigo: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  nombreCompleto: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  cuotasAdeudadas: {
    type: Number,
    required: true,
  },
  dni: {
    type: String,
    required: true,
    trim: true
  },
  tipoUsuario: {
    type: String,
    required: true,
    trim: true,
    default: "socio"
  }
});

const Socio = mongoose.model("Socio", socioSchema);

export default Socio;