const express = require("express");
const router = express.Router();
const passport = require("passport");
const UserController = require("../controllers/user.controller.js");

const userController = new UserController();

//Registrarse
router.post("/register", userController.register);
//Loguearse
router.post("/login", userController.login);
//Obtener el perfil del usuario
router.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  userController.profile
);
//Desloguearse
router.post("/logout", userController.logout.bind(userController));
//Admin
router.get(
  "/admin",
  passport.authenticate("jwt", { session: false }),
  userController.admin
);
//User Artillery
router.get("/user", userController.user);

module.exports = router;
