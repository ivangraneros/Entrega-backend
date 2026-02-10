import express from 'express';
const router = express.Router();
import { paths } from '../config/config.js';


import CartManager from '../data-access-object/cartDao.js';
const newCartManager = new CartManager("data/carts.json");




router.get("/", async (req, res) => {
  try {
    const carts = await newCartManager.getCarts();
    res.status(200).json(carts);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener carrito" });
  }
});


router.post("/", async (req, res) => {
  try {
    const newCart = await newCartManager.createCart();
    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).json({ message: "Error al crear carrito" });
  }
});


  router.get("/:id",async (req, res) => {
    const { id } = req.params;
    const cart = await newCartManager.getCartById(id);
    if (cart) {
      res.status(200).json(cart);
    } else {
      res.status(404).json({ message: "Carrito no encontrado" });
    }
});

  router.post("/:cartId/products/:productId",async (req, res) => {
    const { cartId, productId } = req.params;
    const updatedCart = await newCartManager.addProductToCart(cartId, productId);
    if (updatedCart) {
      res.status(200).json(updatedCart);
    } else {
      res.status(404).json({ message: "Error interno" });
    }
});


export default router;