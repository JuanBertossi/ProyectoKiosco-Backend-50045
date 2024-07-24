const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const mongoUri = process.env.MONGODB_URI;

mongoose
  .connect(mongoUri, {
    serverSelectionTimeoutMS: 30000,
  })
  .then(() => console.log("Conexión exitosa a la base de datos"))
  .catch((error) =>
    console.log("Error en la conexión a la base de datos:", error)
  );

module.exports = mongoose;
