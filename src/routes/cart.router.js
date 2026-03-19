import express from 'express';
const router = express.Router();
import { paths } from '../config/config.js';
import passport from 'passport';
import { authorization } from '../middlewares/auth.middleware.js';


import CartManager from '../data-access-object/cartDao.js';
const newCartManager = new CartManager("data/carts.json");
import cartController from '../controllers/cart.controller.js';
import cartModel from '../models/cart.model.js';



// router.get("/", async (req, res) => {
//   try {
//     const carts = await newCartManager.getCarts();
//     res.status(200).json(carts);
//   } catch (error) {
//     res.status(500).json({ message: "Error al obtener carrito" });
//   }
// });


router.post("/", async (req, res) => {
  try {
    const newCart = await newCartManager.createCart();
    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).json({ message: "Error al crear carrito" });
  }
});


  router.get("/:cid",async (req, res) => {
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {
    try {
    const { cid } = req.params;
    const cart = await cartModel.findById(cid.populate('products.product').lean());
    if (!cart) {
      return res.status(404).json({ message: "Carrito no encontrado" });
    }
    res.render("pages/carrito", { cart,
      products: cart.products,
      user : req.user });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener carrito" });
  }
}
});


  router.post("/products/:productId",
    passport.authenticate('jwt', {session: false}),
    authorization("user"),
    async (req, res) => {
      try {
    const { productId } = req.params;
    const cartId = req.user.cart;

    const updatedCart = await cartModel.findById(cartId);
    if (!updatedCart) {
      return res.status(404).json({ message: "Carrito no encontrado" });
    }

    const productIndex = updatedCart.products.findIndex(
      p => p.product.toString() === productId
    );
    if (productIndex !== -1) {
      updatedCart.products[productIndex].quantity += 1;
    }else {
      updatedCart.products.push({ product: productId, quantity: 1 });
    }
    await updatedCart.save();
    res.status(200).json({ status: "success", payload: updatedCart });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Error al agregar producto al carrito" });
  }
});

router.post('/:cid/purchase', 
    passport.authenticate('jwt', { session: false }), 
    cartController.purchase 
    
);


export default router;