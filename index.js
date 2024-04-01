import express from 'express';
import dotenv from 'dotenv';
import conectarDB from './config/db.js';
import socioRoutes from './routes/socioRoutes.js';
import cors from 'cors';
import productoRoutes from "./routes/productoRoutes.js";
import ventaRoutes from "./routes/ventaRoutes.js"

const app = express();
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ limit: '20mb', extended: true }));

dotenv.config();

conectarDB();

// Configuracion para Cors
const dominiosPermitidos = [process.env.FRONTEND_URL,process.env.URL_VERCEL];
// const dominiosPermitidos = ["*"];
const corsOptions = {
  origin: (origin,callback) => {
    if (dominiosPermitidos.indexOf(origin) !== -1) {
      callback(null,true)
    }else{
      callback(new Error("No permitido por cors"))
    }
  }
}
app.use(cors(corsOptions));

app.use("/", socioRoutes);
app.use("/", productoRoutes);
app.use("/", ventaRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Servidor funcando en el puerto http://localhost:${PORT}`);
});