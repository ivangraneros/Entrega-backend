import express from "express";
const router = express.Router();

import productsRouter from "./products.router.js";
import cartRouter from "./cart.router.js";
import viewsProduct from "./views.product.js"
import viewsCarrito from "./views.carrito.js";
import sessionsRouter from "./sessions.router.js";
import viewsSessions from "./views.router.js";
import viewsRouter from "./views.router.js";

router.use("/api/products", productsRouter);
router.use("/api/carts", cartRouter);
router.use("/api/sessions", sessionsRouter)
router.use("/api/views", viewsRouter);


router.use("/products", viewsProduct);
router.use("/carrito", viewsCarrito);
router.use("/", viewsSessions);



export default router;