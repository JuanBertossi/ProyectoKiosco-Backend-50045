const express = require("express");
const router = express.Router();
const CartController = require("../controllers/cart.controller.js");
const cartController = new CartController();

//Crear carrito
router.post("/", cartController.nuevoCarrito);
//Listar productos Del Carrito
router.get("/:cid", cartController.obtenerProductosDeCarrito);
//Agregar Productos En Carrito
router.post("/:cid/product/:pid", cartController.agregarProductoEnCarrito);
//Eliminar Productos Del Carrito
router.delete("/:cid/product/:pid", cartController.eliminarProductoDeCarrito);
//Actualizar Productos Del Carrito
router.put("/:cid", cartController.actualizarProductosEnCarrito);
//Actualizar Cantidad Productos Del Carrito
router.put("/:cid/product/:pid", cartController.actualizarCantidades);
//Vaciar Carrito
router.delete("/:cid", cartController.vaciarCarrito);

module.exports = router;
