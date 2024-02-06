const express = require("express");
const router = express.Router();
const ProductManager = require("../controllers/ProductManager.js");
const productManager = new ProductManager("./src/models/productos.json");

router.get("/", async (req, res) => {
  try {
    const productos = await productManager.getProducts();
    res.render("home", { productos: productos });
  } catch (error) {
    console.log("Error al obtener los productos:", error);
    res.status(500).json({ errors: "Error interno" });
  }
});

router.get("/realtimeproducts", async (req, res) => {
  try {
    res.render("realtimeproducts");
  } catch (error) {
    console.log("Error en la vista realtime", error);
    res.status(500).json({ error: "Error interno" });
  }
});

module.exports = router;
