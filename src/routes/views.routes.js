const express = require("express");
const router = express.Router();
const ViewsController = require("../controllers/view.controller.js");
const viewsController = new ViewsController();
const checkUserRole = require("../middleware/chekrole.js");
const passport = require("passport");
const mockingProductsController = require("../controllers/mockingProductsController");

//Ruta Productos
router.get(
  "/products",
  checkUserRole(["usuario"]),
  passport.authenticate("jwt", { session: false }),
  viewsController.renderProducts
);
//Ruta Carrito
router.get("/carts/:cid", viewsController.renderCart);
//Loguearse
router.get("/login", viewsController.renderLogin);
//Registrarse
router.get("/register", viewsController.renderRegister);
router.get(
  "/realtimeproducts",
  checkUserRole(["admin"]),
  viewsController.renderRealTimeProducts
);
//Ruta Chat
router.get("/chat", checkUserRole(["usuario"]), viewsController.renderChat);
router.get("/", viewsController.renderHome);
//Mocking Products
router.get("/mockingproducts", mockingProductsController.generateMockProducts);

module.exports = router;
