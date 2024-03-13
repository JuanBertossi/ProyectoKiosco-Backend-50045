const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const exphbs = require("express-handlebars");
const userRouter = require("./routes/user.routes.js");
const sessionRouter = require("./routes/session.routes.js");
const viewsRouter = require("./routes/views.routes.js");
const initializePassport = require("./config/passport.config.js");
const passport = require("passport");
const app = express();
const PUERTO = 8080;
require("./database.js");

//Express-Handlebar
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

//Middleware
app.use(express.static("./src/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    secret: "secretCoder",
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl:
        "mongodb+srv://bertossijuani:Juanito2023@cluster0.ff4gbbu.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0",
      ttl: 100,
    }),
  })
);

//Passport:
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/users", userRouter);
app.use("/api/sessions", sessionRouter);
app.use("/", viewsRouter);

app.listen(PUERTO, () => {
  console.log(`Escuchando en el puerto: ${PUERTO}`);
});
