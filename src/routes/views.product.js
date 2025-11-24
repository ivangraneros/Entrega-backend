const express = require("express");
const router = express.Router();


const ProductManager = require ('../productManager');
const newProductManager = new ProductManager("data/products.json");


// vista de handlebars de productos


router.get('/', async (req, res) => {
  try {
    const products = await newProductManager.getAllProducts();
    res.render('pages/realTimeProducts', { products });
  } catch (error) {
    res.status(500).send("Error al cargar la vista de productos");
  }
});


router.post("/", async (req, res) => {
  try {
  const productData = req.body;
  console.log("Body recibido:", productData);
  const newProduct =  await newProductManager.addProduct(productData);
  res.render("pages/realTimeProducts", {});
  } catch (error) {
    res.status(500).json('Error al agregar producto')
  }
});



module.exports = router;