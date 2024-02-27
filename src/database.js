//MongoDB

const mongoose = require("mongoose");

//Conexion Base De Datos

mongoose
  .connect(
    "mongodb+srv://bertossijuani:Juanito2023@cluster0.ff4gbbu.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("Conexion exitosa"))
  .catch(() => console.log("Error en la conexion"));
