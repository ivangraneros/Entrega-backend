import express from "express";
const router = express.Router();
import passport from "passport";
import { authorization } from "../middlewares/auth.middleware.js";


import ProductManager from '../data-access-object/productDao.js';
const newProductManager = new ProductManager("data/products.json");


router.get("/", async (req, res) => {
  try {
    const products = await newProductManager.getAllProducts();
    res.render("/realTimeProducts", { products });
  } catch (error) {
    res.status(500).json("Error al obtener productos");
  }
});


router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const product = await newProductManager.getProductById(id);
  if (product) {
    res.status(200).json(product);
  } else {
    res.status(404).json({ message: "Producto no encontrado" });
  }
});

router.post("/",
  passport.authenticate('jwt', {session: false}),
  authorization("admin"),
  async (req, res) => {
  try {
  const productData = req.body;
  console.log("Body recibido:", productData);
  const newProduct =  await newProductManager.addProduct(productData);
  res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json('Error al agregar producto')
  }
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  const updatedProduct = newProductManager.updateProductById(updateData, id);
  if (updatedProduct) {
    res.status(200).json(updatedProduct);
  } else {
    res.status(404).json({ message: "Producto no encontrado" });
  }
});

router.delete("/:id",
  passport.authenticate('jwt', {session: false}),
  authorization("admin"),
  (req, res) => {
  const { id } = req.params;
  const deleted = newProductManager.deleteProductById(id);
  if (deleted) {
    res.status(200).json({ message: "Producto eliminado" });
  } else {
    res.status(404).json({ message: "Producto no encontrado" });
  }
});


export default router;