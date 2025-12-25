const express = require("express");
const router = express.Router();

const productsRouter = require("./products.router");
const cartRouter = require("./cart.router");
const viewsProduct = require ("./views.product")
const viewsCarrito = require ("./views.carrito");


router.use("/api/products", productsRouter);
router.use("/api/carts", cartRouter);
router.use("/products", viewsProduct);
router.use("/carrito", viewsCarrito);



module.exports = router;