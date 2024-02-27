const express = require("express");
const app = express();
const PUERTO = 8080;
const exphbs = require("express-handlebars");
require("./database.js");
const productsRouter = require("./routes/products.router.js");
const cartsRouter = require("./routes/carts.routes.js");

//Handlebars
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

//Middleware
app.use(express.json());
app.use(express.static("./src/public"));

//Routing
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

const httpServer = app.listen(PUERTO, () => {
  console.log(`Servidor escuchando en el puerto ${PUERTO}`);
});
