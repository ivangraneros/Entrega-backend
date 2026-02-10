import  express from 'express'
const app = express()
import  routes from './routes/index.js';
import  path  from 'path';
import  mongoose  from 'mongoose';
import passport from "passport";


import cookieParser from "cookie-parser"
import { configPassport } from "./config/passport.config.js";


import  { Server }  from "socket.io";
import  handlebars  from'express-handlebars';



import  CartManager  from"./data-access-object/cartDao.js";
import  ProductManager  from"./data-access-object/productDao.js";

import { PORT, paths } from './config/config.js';

const newCartManager = new CartManager();
const newProductManager = new ProductManager();


app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(paths.public));
app.set("views", paths.views);



configPassport()
app.use(passport.initialize());



app.get("/", async (req, res) => {
  try {
    const products = await newProductManager.getAllProducts(req.query);
    res.render("pages/home", { products: products.payload  });
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


mongoose
  .connect("mongodb+srv://ivancapo2003_db_user:Ivan2003@cluster0.kfrcnez.mongodb.net/ecommerce?appName=Cluster0")
  .then(() => console.log("Conectado a la base de datos MongoDB"))
  .catch((err) => console.error("Error al conectar a la base de datos MongoDB:", err));

// conexion del servidor con socket.io

const server = app.listen(8080, () => {
  console.log("Server up on port 8080");
});

const io = new Server(server);

io.on("connection", async (socket) => {
  console.log("Cliente conectado con ID:", socket.id);

  const result = await newProductManager.getAllProducts({});
  socket.emit("productosActualizados", result.payload || []);

  socket.on("nuevoProducto", async (data) => {
    try {
      await newProductManager.createProduct(data);
      const updated = await newProductManager.getAllProducts({});
      io.emit("productosActualizados", updated.payload || []);
    } catch (err) {
      console.error("Error al agregar producto:", err);
    }
  });

  socket.on("eliminarProducto", async (id) => {
    try {
      await newProductManager.deleteProductById(id);
      const productosActualizados = await newProductManager.getAllProducts({});
      io.emit("productosActualizados", productosActualizados.payload || []);
    } catch (err) {
      console.error("Error al eliminar producto:", err);
    }
  });
});


export default app;