const CartRepository = require("../repositories/cart.repositories");
const cartRepository = new CartRepository();

class CartController {
  async nuevoCarrito(req, res) {
    try {
      const nuevoCarrito = await cartRepository.crearCarrito();
      res.json(nuevoCarrito);
    } catch (error) {
      res.status(500).send("Error al crear el carrito");
    }
  }

  async obtenerProductosDeCarrito(req, res) {
    const carritoId = req.params.cid;
    try {
      const productos = await cartRepository.obtenerProductosDelCarrito(
        carritoId
      );

      res.json(productos);
    } catch (error) {
      res.status(500).send("Error al obtener los productos del carrito");
    }
  }

  async agregarProductoEnCarrito(req, res) {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity || 1;

    try {
      await cartRepository.agregarProducto(cartId, productId, quantity);

      res.send("Producto Agregado");
    } catch (error) {
      res.status(500).send("Error al agregar el producto");
    }
  }

  async eliminarProductoDeCarrito(req, res) {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    try {
      const carrito = await cartRepository.eliminarProducto(cartId, productId);
      res.json({
        status: "success",
        message: "Produco eliminado correctamente",
        carrito,
      });
    } catch (error) {
      res.status(500).send("Error al eliminar el producto");
    }
  }

  async actualizarProductosEnCarrito(req, res) {
    const cartId = req.params.cid;
    const updatedProducts = req.body;
    try {
      const carrito = await cartRepository.actualizarProductosEnCarrito(
        cartId,
        updatedProducts
      );
      res.json({
        status: "success",
        message: "Carrito actualizado",
        carrito,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send("Error al actualizar los productos");
    }
  }

  async actualizarCantidades(req, res) {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const newQuantity = req.body.quantity;
    try {
      const carrito = await cartRepository.actualizarCantidadesEnCarrito(
        cartId,
        productId,
        newQuantity
      );
      res.json({
        status: "success",
        message: "Carrito actualizado en sus cantidades",
        carrito,
      });
    } catch (error) {
      res.status(500).send("Error al actualizar las cantidades");
    }
  }

  async vaciarCarrito(req, res) {
    const cartId = req.params.cid;
    try {
      const carrito = await cartRepository.vaciarCarrito(cartId);

      res.json({
        status: "success",
        message: "Todos los productos del carrito fueron eliminados",
        carrito,
      });
    } catch (error) {
      res.status(500).send("Error al vaciar el carrito");
    }
  }
}

module.exports = CartController;
