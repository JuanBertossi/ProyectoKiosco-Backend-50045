const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://bertossijuani:Juanito2023@cluster0.ff4gbbu.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("Conexión exitosa"))
  .catch(() => console.log("Error en la conexión"));
