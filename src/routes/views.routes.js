const express = require("express");
const router = express.Router();
const ProductController = require("../controllers/products.controller");
const CartController = require("../controllers/cart.controller");
const productController = new ProductController();
const cartController = new CartController();

// Rutas de productos
router.get("/products", async (req, res) => {
  await productController.getProducts(req, res);
});

// Rutas de carrito
router.get("/carts/:cid", async (req, res) => {
  await cartController.getCartById(req, res);
});

// Ruta del formulario de inicio de sesión
router.get("/login", (req, res) => {
  if (req.session.login) {
    return res.redirect("/profile");
  }
  res.render("login");
});

// Ruta del formulario de registro
router.get("/register", (req, res) => {
  if (req.session.login) {
    return res.redirect("/profile");
  }
  res.render("register");
});

// Ruta de la vista de perfil
router.get("/profile", (req, res) => {
  if (!req.session.login) {
    return res.redirect("/login");
  }
  res.render("profile", { user: req.session.user });
});

module.exports = router;
