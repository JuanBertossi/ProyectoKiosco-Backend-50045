const ProductRepository = require("../repositories/product.repository.js");
const productRepository = new ProductRepository();

class ProductController {
  async addProduct(req, res) {
    const nuevoProducto = req.body;
    try {
      await productRepository.agregarProducto(nuevoProducto);
    } catch (error) {
      res.status(500).send("Error");
    }
  }

  async getProducts(req, res) {
    try {
      let { limit = 10, page = 1, sort, query } = req.query;

      const productos = await productRepository.obtenerProductos(
        limit,
        page,
        sort,
        query
      );

      res.json(productos);
    } catch (error) {
      res.status(500).send("Error");
    }
  }

  async getProductById(req, res) {
    const id = req.params.pid;
    try {
      const buscado = await productRepository.obtenerProductoPorId(id);
      if (!buscado) {
        return res.json({
          error: "Producto no encontrado",
        });
      }
      res.json(buscado);
    } catch (error) {
      res.status(500).send("Error");
    }
  }

  async updateProduct(req, res) {
    try {
      const id = req.params.pid;
      const productoActualizado = req.body;

      const resultado = await productRepository.actualizarProducto(
        id,
        productoActualizado
      );
      res.json(resultado);
    } catch (error) {
      res.status(500).send("Error al actualizar el producto");
    }
  }

  async deleteProduct(req, res) {
    const productId = req.params.pid;
    const userEmail = req.user.email;

    try {
      const deletedProduct = await productRepository.eliminarProducto(
        productId,
        userEmail
      );

      if (!deletedProduct) {
        return res.status(404).json({ message: "Producto no encontrado" });
      }

      res.json({ message: "Producto eliminado exitosamente" });
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }
}

module.exports = ProductController;
