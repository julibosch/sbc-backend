import express from 'express';
import dotenv from 'dotenv';
import conectarDB from './config/db.js';
import socioRoutes from './routes/socioRoutes.js';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
app.use(express.json());
dotenv.config();

conectarDB();

//Configuracion para Cors
const dominiosPermitidos = [process.env.FRONTEND_URL];
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
// app.use(cors({ origin: '*' }));

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use("/", socioRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Servidor funcando en el puerto http://localhost:${PORT}`);
});