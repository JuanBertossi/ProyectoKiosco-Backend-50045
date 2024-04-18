const express = require("express");
const router = express.Router();
const ProductController = require("../controllers/products.controller");
const productController = new ProductController();

// Obtener todos los productos
router.get("/", productController.getProducts);
// Agregar un nuevo producto
router.post("/", productController.addProduct);
// Obtener un producto por su ID
router.get("/:pid", productController.getProductById);
// Actualizar un producto por su ID
router.put("/:pid", productController.updateProduct);
// Eliminar un producto por su ID
router.delete("/:pid", productController.deleteProduct);

module.exports = router;
