import sanitize from "mongo-sanitize";

const validarCamposProductos = (descripcion, precio, categoria, res) => {
  if (!descripcion) return "Descripción es requerida";
  if (typeof descripcion !== "string") return "Descripción debe ser string";
  if (!precio) return "Precio es requerido";
  if (typeof precio !== "number") return "Precio debe ser un número";
  if (!categoria) return "Categoría es requerida";
  if (typeof categoria !== "string") return "Categoría debe ser string";
  return null; // No hay errores
}

const sanitizarDatosProductos = (descripcion, precio, categoria) => {
  const descripcionSanitizada = sanitize(descripcion);
  const precioSanitizado = sanitize(precio);
  const categoriaSanitizada = sanitize(categoria);
  return { descripcionSanitizada, precioSanitizado, categoriaSanitizada }
}

export {validarCamposProductos, sanitizarDatosProductos}