const ProductModel = require("../models/product.model.js");

class ProductRepository {
  async agregarProducto({
    title,
    description,
    price,
    img,
    code,
    stock,
    category,
    thumbnails,
    owner,
  }) {
    try {
      if (!title || !description || !price || !code || !stock || !category) {
        console.log("Todos los campos son obligatorios");
        return;
      }

      const existeProducto = await ProductModel.findOne({ code: code });

      if (existeProducto) {
        console.log("El código debe ser único, malditooo!!!");
        return;
      }

      console.log("Owner", owner);

      const newProduct = new ProductModel({
        title,
        description,
        price,
        img,
        code,
        stock,
        category,
        status: true,
        thumbnails: thumbnails || [],
        owner,
      });

      await newProduct.save();

      return newProduct;
    } catch (error) {
      throw new Error("Error");
    }
  }

  async obtenerProductos(limit = 10, page = 1, sort, query) {
    try {
      const skip = (page - 1) * limit;

      let queryOptions = {};

      if (query) {
        queryOptions = { category: query };
      }

      const sortOptions = {};
      if (sort) {
        if (sort === "asc" || sort === "desc") {
          sortOptions.price = sort === "asc" ? 1 : -1;
        }
      }

      const productos = await ProductModel.find(queryOptions)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit);

      const totalProducts = await ProductModel.countDocuments(queryOptions);

      const totalPages = Math.ceil(totalProducts / limit);

      const hasPrevPage = page > 1;
      const hasNextPage = page < totalPages;

      return {
        docs: productos,
        totalPages,
        prevPage: hasPrevPage ? page - 1 : null,
        nextPage: hasNextPage ? page + 1 : null,
        page,
        hasPrevPage,
        hasNextPage,
        prevLink: hasPrevPage
          ? `/api/products?limit=${limit}&page=${
              page - 1
            }&sort=${sort}&query=${query}`
          : null,
        nextLink: hasNextPage
          ? `/api/products?limit=${limit}&page=${
              page + 1
            }&sort=${sort}&query=${query}`
          : null,
      };
    } catch (error) {
      throw new Error("Error");
    }
  }

  async obtenerProductoPorId(id) {
    try {
      const producto = await ProductModel.findById(id);

      if (!producto) {
        console.log("Producto no encontrado");
        return null;
      }

      console.log("Producto encontrado");
      return producto;
    } catch (error) {
      throw new Error("Error");
    }
  }

  async actualizarProducto(id, productoActualizado) {
    try {
      const actualizado = await ProductModel.findByIdAndUpdate(
        id,
        productoActualizado
      );
      if (!actualizado) {
        console.log("No se encuentra el producto");
        return null;
      }

      console.log("Producto actualizado con exito");
      return actualizado;
    } catch (error) {
      throw new Error("Error");
    }
  }

  async eliminarProducto(id, userEmail) {
    try {
      const deletedProduct = await ProductModel.findByIdAndDelete(id);

      if (!deletedProduct) {
        console.log("Producto no encontrado");
        return null;
      }

      if (userEmail) {
        await emailManager.enviarCorreoProductoEliminado(
          userEmail,
          deletedProduct.name
        );
      }

      console.log("Producto eliminado correctamente");
      return deletedProduct;
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      throw new Error("Error interno del servidor");
    }
  }
}

module.exports = ProductRepository;
