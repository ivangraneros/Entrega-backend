const express = require("express");
const router = express.Router();

const CartManager = require ('../cartManager');
const newCartManager = new CartManager("data/carts.json");



// vista de handlebars de carrito

router.get("/", async (req, res) => {
  try {
    const carts = await newCartManager.getCarts();
    res.render("pages/carrito", { carts });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener carrito" });
  }

});

module.exports = router;