class CustomError extends Error {
  constructor(mensaje, nombre = "Error", causa = "Desconocido", codigo = 1) {
    super(mensaje);
    this.name = nombre;
    this.causa = causa;
    this.code = codigo;
  }
}

module.exports = CustomError;
