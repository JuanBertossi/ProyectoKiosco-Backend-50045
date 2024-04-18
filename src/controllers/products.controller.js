const ProductRepository = require("../repositories/products.repositories.js");
const productRepository = new ProductRepository();

class ProductController {
  async getProducts(req, res) {
    try {
      const productos = await productRepository.getAllProducts();
      res.status(200).json(productos);
    } catch (error) {
      res.status(500).json({ error: "Error del servidor" });
    }
  }

  async addProduct(req, res) {
    const nuevoProducto = req.body;
    try {
      await productRepository.addProduct(nuevoProducto);
      res.status(200).send("Producto creado");
    } catch (error) {
      res
        .status(500)
        .json({ error: "Error del servidor al agregar el producto" });
    }
  }

  async getProductById(req, res) {
    const productId = req.params.pid;
    try {
      const producto = await productRepository.getProductById(productId);
      if (!producto) {
        return res.status(404).json({ error: "Producto no encontrado" });
      }
      res.status(200).json(producto);
    } catch (error) {
      res.status(500).json({ error: "Error del servidor" });
    }
  }

  async updateProduct(req, res) {
    const productId = req.params.pid;
    const updatedProduct = req.body;
    try {
      const producto = await productRepository.updateProduct(
        productId,
        updatedProduct
      );
      if (!producto) {
        return res.status(404).json({ error: "Producto no encontrado" });
      }
      res.status(200).send("Producto actualizado");
    } catch (error) {
      res.status(500).json({ error: "Error del servidor" });
    }
  }

  async deleteProduct(req, res) {
    const productId = req.params.pid;
    try {
      const producto = await productRepository.deleteProduct(productId);
      if (!producto) {
        return res.status(404).json({ error: "Producto no encontrado" });
      }
      res.status(200).send("Producto eliminado");
    } catch (error) {
      res.status(500).json({ error: "Error del servidor" });
    }
  }
}

module.exports = ProductController;
