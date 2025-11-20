const express = require("express");
const router = express.Router();

const productsRouter = require("./products.router");
const cartRouter = require("./cart.router");


router.use("/products", productsRouter);
router.use("/carts", cartRouter);



module.exports = router;