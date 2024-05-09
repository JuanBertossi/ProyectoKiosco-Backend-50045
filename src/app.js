const express = require("express");
const app = express();
const exphbs = require("express-handlebars");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const compression = require("express-compression");
const initializePassport = require("../src/config/passport.config.js");
const addLogger = require("../src/utils/logger.js");
const cors = require("cors");
const path = require("path");
const PUERTO = 8080;
require("./database.js");

const productsRouter = require("../src/routes/products.router.js");
const cartsRouter = require("../src/routes/carts.routes.js");
const viewsRouter = require("../src/routes/views.routes.js");
const userRouter = require("../src/routes/user.routes.js");

//Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
app.use(addLogger);

//Test

app.get("/loggerTest", (req, res) => {
  req.logger.error("Vamos a morir");
  req.logger.warning("Cuidado! Hombre radiactivo!");
  req.logger.info("Estamos navegando la app");

  res.send("Logs generados!");
});

//Simulamos algunas operaciones para testear con Artillery:

app.get("/operacionsimple", (req, res) => {
  let suma = 0;
  for (let i = 0; i < 1000000; i++) {
    suma += i;
  }

  res.send({ suma });
});

//Operacion compleja:

app.get("/operacioncompleja", (req, res) => {
  let suma = 0;
  for (let i = 0; i < 5e8; i++) {
    suma += i;
  }

  res.send({ suma });
});

//Passport
app.use(passport.initialize());
initializePassport();
app.use(cookieParser());

//AuthMiddleware
const authMiddleware = require("../src/middleware/authmiddleware.js");
app.use(authMiddleware);

//Compression
app.use(
  compression({
    brotli: {
      enabled: true,
      zlib: {},
    },
  })
);

//Handlebars
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

//Rutas:
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/users", userRouter);
app.use("/", viewsRouter);

const httpServer = app.listen(PUERTO, () => {
  console.log(`Servidor escuchando en el puerto ${PUERTO}`);
});

///Websockets:
const SocketManager = require("../src/socket/socketmanager.js");
new SocketManager(httpServer);
