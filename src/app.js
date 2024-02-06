const express = require("express");
const app = express();
const PUERTO = 8080;
const exphbs = require("express-handlebars");
const socket = require("socket.io");

const viewsRouter = require("./routes/views.routes.js");
const ProductManager = require("../src/controllers/ProductManager.js");
const productManager = new ProductManager("./src/models/productos.json");

//Handlebars
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

//Middleware
app.use(express.json());
app.use(express.static("./src/public"));

//Routing
app.use("/", viewsRouter);

//Array de Usuarios
const usuarios = [
  { id: 1, nombre: "Juan", apellido: "Perez" },
  { id: 2, nombre: "Ricardo", apellido: "Perez" },
  { id: 3, nombre: "Estefano", apellido: "Perez" },
  { id: 4, nombre: "Juanillo", apellido: "Luque" },
];

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

//Inicio de servidor

const httpServer = app.listen(PUERTO, () => {
  console.log(`Escuchando en el puerto ${PUERTO} `);
});

//Socket.io
const io = socket(httpServer);
io.on("connection", async (socket) => {
  console.log("Nuevo cliente conectado");
  //Envio Array
  socket.emit("productos", await productManager.getProducts());
  //Evento eliminar
  socket.on("eliminarProducto", async (id) => {
    await productManager.deleteProduct(id);
    //Envio la lista actualizada al cliente:
    io.sockets.emit("productos", await productManager.getProducts());
  });
  //Agrego Producto
  socket.on("agregarProducto", async (producto) => {
    await productManager.addProduct(producto);
    io.sockets.emit("productos", await productManager.getProducts());
  });
});
