import express from "express";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import __dirname from "./utils.js";
import { engine } from "express-handlebars";
import viewRouter from "./routes/views.router.js";
import { Server } from "socket.io";

import ProductManager from "./productManager.js";
const pManager = new ProductManager();

const app = express();
const PORT = 8080;

//midlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//carpeta public
app.use(express.static(__dirname + "/public/"));

//Configuracion de Hndlebars
app.engine("handlebars", engine()); //extension de los archivos handlebars
app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");

//Ruta para handlebars view router
app.use("/", viewRouter);

//puntos de entrada para ROUTES
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

const httpServer = app.listen(PORT, (req, res) => {
  console.log(`servidor escuchando en el puerto: http://localhost:${PORT}`);
});

//instanciamos socket.io
const socketServer = new Server(httpServer);

socketServer.on("connection", async (socket) => {
  console.log("Nuevo cliente conectado");

  //Enviar productos desde servidor
  try {
    const productos = await pManager.getProducts();
    socket.emit("productosActuales", productos);
  } catch (error) {
    console.error(error.message);
  }

  //recibir productos desde el formulario del cliente
  socket.on("agregarProducto", async (data) => {
    const {
      title,
      description,
      code,
      price,
      status = true,
      thumbnail = '',
      stock,
      category,
    } = data;
    await pManager.addProduct(
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
      status,
      category,
    );
    const updatedProducts = await pManager.getProducts();
    socketServer.emit("products", updatedProducts);
  });

  //recibir id para eliminar producto
  socket.on('eliminarProducto', async data => {
    await pManager.deleteProduct(data); 
    const updatedProducts = await pManager.getProduct();
    socketServer.emit('products', updatedProducts); 
 })
});
