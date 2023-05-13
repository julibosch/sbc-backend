import Socio from "../models/Socio.js";
import sanitize from "mongo-sanitize";

const autenticarSocio = async (req, res) => {
  //Valida que no haya una inyeccion noSQL
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
    const listaSocios = await Socio.find({ tipoUsuario }).sort({nombreCompleto: 'asc'});
    res.send(listaSocios);
  } catch (error) {
    return res.status(401).json({ msg: error.message });
  }
};

//El admin carga el archivo de socios y se actualiza en la base de datos
let contadorUpdate = 0;
let contadorCreate = 0;
let huboError = false; //En caso de que haya un socio duplicado retorna el mensaje de ese socio y no el de que salio todo bien.
let sociosDuplicados = []; //Contiene los socios que tienen duplicado el Codigo y que se valida por DNI.
let contador = 0

const cargarArchivo = async (req, res) => {
  const body = req.body;

  for (const socio of body) {
    const { dni, codigo, nombreCompleto, cuotasAdeudadas } = socio;

    try {
      const existeSocio = await Socio.findOne({ dni });

      if (existeSocio) {
        await Socio.updateOne({ dni }, { cuotasAdeudadas });
        contadorUpdate++
      } else {
        contadorCreate++
        await Socio.create({ dni, codigo, nombreCompleto, cuotasAdeudadas });
      }
    } catch (error) {
      console.log(`Error: ${error}`);
      sociosDuplicados.push(socio)
      huboError = true;
      contador++
      console.log("catch " + contador)
      // return res.status(500).send({ msg: error.message });
    }
    console.log("actualizados: " + contadorUpdate)
    console.log("creados: " +contadorCreate)
  };

  console.log(sociosDuplicados)

  // Devolver respuesta al front
  if (!huboError) {
    res.send({msg: "Los socios se han creado o actualizado con exito!"});
  }

  if (huboError) {
    res.send({msg:`Se actualizaron o crearon con exito, pero existen dni erroneos`, sociosDuplicados})
  }
};


export {
  autenticarSocio,
  obtenerSocios,
  cargarArchivo,
  mostrarPerfil,
  devolverSocio
};