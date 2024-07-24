const express = require("express");
const exphbs = require("express-handlebars");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const initializePassport = require("./config/passport.config.js");
const cors = require("cors");
const path = require("path");
const methodOverride = require("method-override");
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUiExpress = require("swagger-ui-express");
const PUERTO = 8080;
require("./database.js");
require("dotenv").config();

const productsRouter = require("./routes/products.router.js");
const cartsRouter = require("./routes/carts.router.js");
const viewsRouter = require("./routes/views.router.js");
const userRouter = require("./routes/user.router.js");

// Middleware
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
app.use(methodOverride("_method"));

// Passport
app.use(passport.initialize());
initializePassport();
app.use(cookieParser());

// AuthMiddleware
const authMiddleware = require("./middleware/authmiddleware.js");
app.use(authMiddleware);

// Handlebars configuración con runtimeOptions
const handlebars = exphbs.create({
  defaultLayout: "main",
  handlebars: require("handlebars"),
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
  },
});

app.engine("handlebars", handlebars.engine);
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// Rutas:
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/users", userRouter);
app.use("/", viewsRouter);

const httpServer = app.listen(PUERTO, () => {
  console.log(`Servidor escuchando en el puerto ${PUERTO}`);
});

/// Websockets:
const SocketManager = require("./sockets/socketmanager.js");
new SocketManager(httpServer);

// Swagger
const swaggerOptions = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "Proyecto Kiosco",
      description: "App para ventas de productos",
    },
  },
  apis: ["./src/docs/**/*.yaml"],
};

const specs = swaggerJSDoc(swaggerOptions);
app.use("/apidocs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs));
