const express = require("express");
const app = express();
const PUERTO = 8080;

const ProductManager = require("../src/controllers/ProductManager.js");
const productManager = new ProductManager("./src/models/productos.json");

//Middleware
app.use(express.json());

//Traer todos los productos

app.get("/api/products", async (req, res) => {
  try {
    const limit = req.query.limit;
    const productos = await productManager.getProducts();

    if (limit) {
      res.json(productos.slice(0, limit));
    } else {
      res.json(productos);
    }
  } catch (error) {
    console.log("Error al obtener los productos:", error);
    res.status(500).json({ error: "Error en servidor" });
  }
});

//Traer un solo producto por id

app.get("/api/products/:pid", async (req, res) => {
  let id = req.params.pid;
  try {
    const producto = await productManager.getProductById(parseInt(id));
    if (!producto) {
      res.json({ error: "No existe el producto" });
    } else {
      res.json(producto);
    }
  } catch (error) {
    console.log("Error al obtener el producto:", error);
    res.status(500).json({ error: "Error en servidor" });
  }
});

//Agregar un nuevo producto por post:

app.post("/api/products", async (req, res) => {
  const nuevoProducto = req.body;
  console.log(nuevoProducto);
  try {
    await productManager.addProduct(nuevoProducto),
      res.status(201).json({ message: "Producto Agregado" });
  } catch (error) {
    console.log("Error al agregar el producto:", error);
    res.status(500).json({ error: "Error en servidor" });
  }
});

//Actualizamos el producto por id

app.put("/api/products/:pid", async (req, res) => {
  let id = req.params.pid;
  const productoActualizado = req.body;
  try {
    await productManager.updateProduct(parseInt(id), productoActualizado);
    res.json({ message: "Producto actualizado exitosamente" });
  } catch (error) {
    console.log("No se pudo actualizar el producto", error);
    res.status(500).json({ error: "Error en servidor" });
  }
});

//Borramos el producto por id
app.delete("/api/products/:pid", async (req, res) => {
  let id = req.params.pid;
  try {
    await productManager.deleteProduct(parseInt(id));
    res.json({ message: "Producto Borrado Exitosamente" });
  } catch (error) {
    console.log("Error al borrar el producto:", error);
  }
});

app.listen(PUERTO);
