const ProductModel = require("../models/product.model");

class ProductoRepository {
  async traerTodo() {
    try {
      const productos = await ProductModel.find();
      return productos;
    } catch (error) {
      throw new Error("Error al traer todos los productos");
    }
  }

  async crear(productoData) {
    try {
      return await ProductModel.create(productoData);
    } catch (error) {
      throw new Error("Error al traer crear el producto");
    }
  }
}

module.exports = ProductoRepository;
