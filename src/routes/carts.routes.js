const express = require("express");
const router = express.Router();
const CartManager = require("../controllers/cart-managerdb");
const cartManager = new CartManager();
const CartModel = require("../models/cart.model.js");

//Crear nuevo carrito:POST

router.post("/", async (req, res) => {
  try {
    const nuevoCarrito = await cartManager.crearCarrito();
    res.json(nuevoCarrito);
  } catch (error) {
    console.error("Error al crear un nuevo carrito", error);
    res.status(500).json({ error: "Error del servidor" });
  }
});

//Listar los productos del carrito:GET

router.get("/:cid", async (req, res) => {
  const cartId = req.params.cid;

  try {
    const carrito = await CartModel.findById(cartId);

    if (!carrito) {
      console.log("No existe ese carrito con el id");
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    return res.json(carrito.products);
  } catch (error) {
    console.error("Error al obtener el carrito", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

//Agregar productos a distintos carritos:POST

router.post("/:cid/product/:pid", async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const quantity = req.body.quantity || 1;

  try {
    const actualizarCarrito = await cartManager.agregarProductoAlCarrito(
      cartId,
      productId,
      quantity
    );
    res.json(actualizarCarrito.products);
  } catch (error) {
    console.error("Error al agregar producto al carrito", error);
    res.status(500).json({ error: "Error del servidor" });
  }
});

//Eliminar un producto especifico del carrito:DELETE

router.delete("/:cid/product/:pid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    const updatedCart = await cartManager.eliminarProductoDelCarrito(
      cartId,
      productId
    );

    res.json({
      status: "success",
      message: "Producto eliminado del carrito exitosamente",
      updatedCart,
    });
  } catch (error) {
    console.error("Error al eliminar el producto del carrito por ID", error);
    res.status(500).json({
      status: "error",
      error: "Error del servidor",
    });
  }
});

//Actualizar productos del carrito:PUT

router.put("/:cid", async (req, res) => {
  const cartId = req.params.cid;
  const updatedProducts = req.body;

  try {
    const updatedCart = await cartManager.actualizarCarrito(
      cartId,
      updatedProducts
    );
    res.json(updatedCart);
  } catch (error) {
    console.error("Error al actualizar el carrito", error);
    res.status(500).json({
      status: "error",
      error: "Error del servidor",
    });
  }
});

//Actualizar las cantidades de productos:PUT

router.put("/:cid/product/:pid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const newQuantity = req.body.quantity;

    const updatedCart = await cartManager.actualizarCantidadDeProducto(
      cartId,
      productId,
      newQuantity
    );

    res.json({
      status: "success",
      message: "Cantidad del producto actualizada exitosamente",
      updatedCart,
    });
  } catch (error) {
    console.error(
      "Error al actualizar la cantidad del producto en el carrito",
      error
    );
    res.status(500).json({
      status: "error",
      error: "Error del servidor",
    });
  }
});

//Vaciar el carrito:DELETE

router.delete("/:cid", async (req, res) => {
  try {
    const cartId = req.params.cid;

    const updatedCart = await cartManager.vaciarCarrito(cartId);

    res.json({
      status: "success",
      message: "Todos los productos del carrito fueron eliminados exitosamente",
      updatedCart,
    });
  } catch (error) {
    console.error("Error al vaciar todo el carrito", error);
    res.status(500).json({
      status: "error",
      error: "Error del servidor",
    });
  }
});

module.exports = router;
