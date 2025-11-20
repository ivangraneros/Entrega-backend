const express = require('express')
const app = express()
const routes = require('./routes/index');


const handlebars = require('express-handlebars');



const CartManager = require ('./cartManager');
const ProductManager = require('./productManager');
const { paths } = require('./config/config.js');

const newCartManager = new CartManager("data/carts.json");
const newProductManager = new ProductManager("data/products.json");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));



app.use("/public", express.static(paths.public));



app.get('/', (req, res) => {
  return res.render('pages/home', {})
});


app.use("/api", routes);

// CRUD Products
// app.get("/api/products", async (req, res) => {
//   try {
//     const products = await newProductManager.getAllProducts();
//     res.status(200).json(products);
//   } catch (error) {
//     res.status(500).json('Error al obtener productos')
//   }
// });

// app.get("/api/products/:id", async (req, res) => {
//   const { id } = req.params;
//   const product = await newProductManager.getProductById(id);
//   if (product) {
//     res.status(200).json(product);
//   } else {
//     res.status(404).json({ message: "Producto no encontrado" });
//   }
// });

// app.post("/api/products", async (req, res) => {
//   try {
//   const productData = req.body;
//   console.log("Body recibido:", productData);
//   const newProduct =  await newProductManager.addProduct(productData);
//   res.status(201).json(newProduct);
//   } catch (error) {
//     res.status(500).json('Error al agregar producto')
//   }
// });

// app.put("/api/products/:id", (req, res) => {
//   const { id } = req.params;
//   const updateData = req.body;
//   const updatedProduct = newProductManager.updateProductById(updateData, id);
//   if (updatedProduct) {
//     res.status(200).json(updatedProduct);
//   } else {
//     res.status(404).json({ message: "Producto no encontrado" });
//   }
// });

// app.delete("/api/products/:id", (req, res) => {
//   const { id } = req.params;
//   const deleted = newProductManager.deleteProductById(id);
//   if (deleted) {
//     res.status(200).json({ message: "Producto eliminado" });
//   } else {
//     res.status(404).json({ message: "Producto no encontrado" });
//   }
// });


// CRUD Carts

// app.get("/api/carts", async (req, res) => {
//   try {
//     const carts = await newCartManager.getCarts();
//     res.status(200).json(carts);
//   } catch (error) {
//     res.status(500).json({ message: "Error al obtener carrito" });
//   }
// });


// app.post("/api/carts", async (req, res) => {
//   try {
//     const newCart = await newCartManager.createCart();
//     res.status(201).json(newCart);
//   } catch (error) {
//     res.status(500).json({ message: "Error al crear carrito" });
//   }
// });


//   app.get("/api/carts/:id",async (req, res) => {
//     const { id } = req.params;
//     const cart = await newCartManager.getCartById(id);
//     if (cart) {
//       res.status(200).json(cart);
//     } else {
//       res.status(404).json({ message: "Carrito no encontrado" });
//     }
// });

//   app.post("/api/carts/:cartId/products/:productId",async (req, res) => {
//     const { cartId, productId } = req.params;
//     const updatedCart = await newCartManager.addProductToCart(cartId, productId);
//     if (updatedCart) {
//       res.status(200).json(updatedCart);
//     } else {
//       res.status(404).json({ message: "Error interno" });
//     }
// });


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



module.exports = app;