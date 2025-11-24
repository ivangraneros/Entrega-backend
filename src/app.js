const express = require('express')
const app = express()
const routes = require('./routes/index');
const path = require('path');

const { Server } = require ("socket.io");
const handlebars = require('express-handlebars');


const CartManager = require ('./cartManager');
const ProductManager = require('./productManager');
const { paths } = require('./config/config.js');

const newCartManager = new CartManager("data/carts.json");
const newProductManager = new ProductManager("data/products.json");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(paths.public));
console.log(paths.public);


app.get("/", async (req, res) => {
  try {
    const products = await newProductManager.getAllProducts();
    res.render("pages/home", { products });
  } catch (error) {
    console.error("Error al cargar productos en home:", error);
    res.status(500).send("Error al cargar productos");
  }
});


app.use("/", routes);


//configurar handlebars

app.engine(
  "hbs",
  handlebars.engine({
    extname: ".hbs",
    defaultLayout: "main",
  })
);

app.set("view engine", "hbs");
app.set("views", paths.views);


// conexion del servidor con socket.io

const server = app.listen(8080, () => {
  console.log("Server up on port 8080");
});

const io = new Server(server);

io.on("connection", async (socket) => {
  console.log("Cliente conectado con ID:", socket.id);

  socket.emit("productosActualizados", await newProductManager.getAllProducts());

  socket.on("nuevoProducto", async (data) => {
    try {
      await newProductManager.addProduct(data);
      const productosActualizados = await newProductManager.getAllProducts();
      io.emit("productosActualizados", productosActualizados);
    } catch (err) {
      console.error("Error al agregar producto:", err);
    }
  });

  socket.on("eliminarProducto", async (id) => {
    try {
      await newProductManager.deleteProductById(id);
      const productosActualizados = await newProductManager.getAllProducts();
      io.emit("productosActualizados", productosActualizados);
    } catch (err) {
      console.error("Error al eliminar producto:", err);
    }
  });
});


module.exports = app;