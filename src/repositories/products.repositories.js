const ProductModel = require("../models/product.model");

class ProductRepository {
  async getAllProducts() {
    try {
      const products = await ProductModel.find();
      return products;
    } catch (error) {
      throw new Error("Error al obtener todos los productos");
    }
  }

  async addProduct(productData) {
    try {
      const productoCreado = await ProductModel.create(productData);
      console.log("Producto creado:", productoCreado);
      return productoCreado;
    } catch (error) {
      throw new Error("Error del servidor al agregar el producto");
    }
  }

  async getProductById(pid) {
    try {
      const product = await ProductModel.findById(pid);
      return product;
    } catch (error) {
      throw new Error("Error al obtener el producto por ID");
    }
  }

  async updateProduct(pid, updatedProductData) {
    try {
      const updatedProduct = await ProductModel.findByIdAndUpdate(
        pid,
        updatedProductData,
        { new: true }
      );
      return updatedProduct;
    } catch (error) {
      throw new Error("Error al actualizar el producto");
    }
  }

  async deleteProduct(pid) {
    try {
      const deletedProduct = await ProductModel.findByIdAndDelete(pid);
      return deletedProduct;
    } catch (error) {
      throw new Error("Error al eliminar el producto");
    }
  }
}

module.exports = ProductRepository;
