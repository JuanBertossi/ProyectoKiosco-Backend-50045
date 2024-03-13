const express = require("express");
const router = express.Router();
const ProductManager = require("../controllers/product-managerdb.js");
const CartManager = require("../controllers/cart-managerdb.js");
const productManager = new ProductManager();
const cartManager = new CartManager();

//Ruta Productos

router.get("/products", async (req, res) => {
  try {
    const { page = 1, limit = 2 } = req.query;
    const productos = await productManager.getProducts({
      page: parseInt(page),
      limit: parseInt(limit),
    });

    const nuevoArray = productos.docs.map((producto) => {
      const { _id, ...rest } = producto.toObject();
      return rest;
    });

    res.render("products", {
      productos: nuevoArray,
      hasPrevPage: productos.hasPrevPage,
      hasNextPage: productos.hasNextPage,
      prevPage: productos.prevPage,
      nextPage: productos.nextPage,
      currentPage: productos.page,
      totalPages: productos.totalPages,
    });
  } catch (error) {
    console.error("Error al obtener productos", error);
    res.status(500).json({
      status: "error",
      error: "Error del servidor",
    });
  }
});

//Ruta carrito

router.get("/carts/:cid", async (req, res) => {
  const cartId = req.params.cid;

  try {
    const carrito = await cartManager.getCarritoById(cartId);

    if (!carrito) {
      console.log("No existe id de este carrito");
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    const productosEnCarrito = carrito.products.map((item) => ({
      product: item.product.toObject(),
      quantity: item.quantity,
    }));

    res.render("carts", { productos: productosEnCarrito });
  } catch (error) {
    console.error("Error al obtener el carrito", error);
    res.status(500).json({ error: "Error del servidor" });
  }
});

//Ruta formulario Login

router.get("/login", (req, res) => {
  if (req.session.login) {
    return res.redirect("/profile");
  }
  res.render("login");
});

// Ruta para el formulario registro
router.get("/register", (req, res) => {
  if (req.session.login) {
    return res.redirect("/profile");
  }
  res.render("register");
});

// Ruta para la vista de perfil
router.get("/profile", (req, res) => {
  if (!req.session.login) {
    return res.redirect("/login");
  }
  res.render("profile", { user: req.session.user });
});

module.exports = router;
