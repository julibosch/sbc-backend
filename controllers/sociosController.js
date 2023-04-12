import Socio from "../models/Socio.js";
import sanitize from "mongo-sanitize";

const autenticarSocio = async (req, res) => {
  //Valida que no haya una inyeccion noSQL
  const apellido = sanitize(req.body.apellido);
  const dni = sanitize(req.body.dni);

  //Consultar si existe el socio en la base de datos
  const socio = await Socio.findOne({ dni }).select("tipoUsuario dni");

  //Si el socio no existe muestra un error
  if (!socio) {
    const error = new Error("El socio no existe");
    return res.status(401).json({ msg: error.message });
  };

  return res.send(socio);
};

//Devuelve los datos del socio para mostrar en el perfil.
const mostrarPerfil = async (req,res) => {

  try {
    const { id } = req.params;
    const socio = await Socio.findById(id).select("nombreCompleto");

    //En caso de que no exista el socio, aunque no deberia pasar porque si llego hasta aca es porque paso el Login
    if (!socio) {
      const error = new Error("El socio no existe");
      return res.status(401).json({ msg: error.message });
    }

    res.send(socio);
    
  } catch (error) {
    return res.status(401).json({ msg: error });
  }
}

// Devolver un socio al leer el QR
const devolverSocio = async (req, res) => {
  const {id} = req.body;
  try {
    const socio = await Socio.findById(id);

    //En caso de que haya pasado otro qr y no tenga un id o el ID de ese QR este mal.
    if (!socio) {
      const error = new Error("El socio no existe");
      return res.status(401).json({ msg: error.message });
    }
    
    res.send(socio);
  } catch (error) {
    const errorCreado = new Error("Socio no registrado");
    return res.status(401).json({ msg: errorCreado.message});
  }
};

//El admin quiere consultar todos los socios
const obtenerSocios = async (req, res) => {
  const tipoUsuario = 'socio';

  try {

    const listaSocios = await Socio.find({ tipoUsuario });
    res.send(listaSocios)

  } catch (error) {

    return res.status(401).json({ msg: error.message });
  }
};

//El admin carga el archivo de socios y se actualiza en la base de datos
const cargarArchivo = async (req, res) => {
  const body = req.body;

  for (const socio of body) {
    const { dni, codigo, nombreCompleto, cuotasAdeudadas } = socio;

    try {
      const existeSocio = await Socio.findOne({ dni });

      if (existeSocio) {
        await Socio.updateOne({ dni }, { cuotasAdeudadas });
      } else {
        await Socio.create({ dni, codigo, nombreCompleto, cuotasAdeudadas });
      }
    } catch (error) {
      console.log(`Error: ${error}`);
      return res.status(500).send('Error al cargar el archivo');
    }
  };

  // Devolver respuesta al front
  res.send({msg: "Los socios se han creado o actualizado con exito!"});
};


export {
  autenticarSocio,
  obtenerSocios,
  cargarArchivo,
  mostrarPerfil,
  devolverSocio
};