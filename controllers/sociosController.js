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
  }

  return res.send(socio);
};

//Devuelve los datos del socio para mostrar en el perfil.
const mostrarPerfil = async (req, res) => {
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
};

// Devolver un socio al leer el QR
const devolverSocio = async (req, res) => {
  const { id } = req.body;

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
    return res.status(401).json({ msg: errorCreado.message });
  }
};

//El admin quiere consultar todos los socios
const obtenerSocios = async (req, res) => {
  const tipoUsuario = "socio";

  try {
    const listaSocios = await Socio.find({ tipoUsuario }).sort({
      nombreCompleto: "asc",
    });
    res.send(listaSocios);
  } catch (error) {
    return res.status(401).json({ msg: error.message });
  }
};

//El admin carga el archivo de socios y se actualiza en la base de datos
const cargarArchivo = async (req, res) => {
  const body = req.body;

  const todosLosSociosDB = await Socio.find(
    { tipoUsuario: "socio" },
    "dni codigo nombreCompleto cuotasAdeudadas"
    ); // Trae todos los socios de la base de datos.
    
    const bodyMapeado = body.map((socio) => ({
      dni: String(socio.dni),
      codigo: String(socio.codigo),
      cuotasAdeudadas: parseInt(socio.cuotasAdeudadas),
      nombreCompleto: socio.nombreCompleto,
    }));

    //Contiene los socios a actualizar, Pero de la BD, por lo tanto no las cuotas nuevas que vienen del front
    const sociosActualizar = todosLosSociosDB.filter((socio) => {
      return bodyMapeado.some((s) => s.dni === socio.dni);
    });

    //Contiene los socios Nuevos, osea los que se van a crear
    const sociosNuevos = bodyMapeado.filter((socio) => {
      return !todosLosSociosDB.some((s) => s.dni === socio.dni);
    });

  try {
    // Construir el objeto de actualización para actualizar masivamente, el metodo find en update es porque necesito pasarle las cuotas nuevas que coincidan con el dni de sociosActualizar
    const actualizaciones = sociosActualizar.map((socio) => ({
      updateOne: {
        filter: { dni: socio.dni },
        update: {
          $set: {
            cuotasAdeudadas: bodyMapeado.find((s) => s.dni === socio.dni)
              .cuotasAdeudadas,
          },
        },
      },
    }));

    // Actualizar los socios existentes
    const resultado = await Socio.bulkWrite(actualizaciones);

    const respuesta2 = await Socio.insertMany(sociosNuevos);

    res.send({ msg: "Los socios se han creado o actualizado con éxito!" });
  } catch (error) {
    console.log(`Error: ${error}`);
    res.status(500).send({ msg: error.message });
  }
};

export {
  autenticarSocio,
  obtenerSocios,
  cargarArchivo,
  mostrarPerfil,
  devolverSocio,
};
