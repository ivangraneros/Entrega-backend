import express from "express";
const router = express.Router();
import cartModel from "../models/cart.model.js";
import productsModel from "../models/products.model.js";




// vista de handlebars de carrito

router.get("/", async (req, res) => {
  try {
    const carts = await cartModel.find().lean();
    res.render("pages/carrito", { carts });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener carrito" });
  }
});

router.post("/", async (req, res) => {
    try {
        const newCart = await cartModel.create({ products: [] });
        res.status(201).json({ 
            status: "success",
            id: newCart._id, 
            payload: newCart 
        });
    } catch (error) {
        console.log("ERROR AL CREAR EN MONGO:", error.message);
        res.status(500).json({ status: "error" });
    }
});

router.post("/products/:pid", async (req, res) => {
  try {
    const { pid } = req.params;

    const cartId = req.user.cart;

    if(!cartId) {
      return res.status(400).json({ status: "error", message: "El usuario no tiene un carrito asociado" });
    }

    const cart = await cartModel.findById(cartId);
    if (!cart) {
      return res.status(404).json({ status: "error", message: "Carrito no encontrado" });
    }

    const productIndex = cart.products.findIndex(
      p => p.product.toString() === pid
    );

    if (productIndex !== -1) {
      cart.products[productIndex].quantity += 1;
    } else {
      cart.products.push({ product: pid, quantity: 1 });
    }
    await cart.save();
    res.json({ status: "success", payload: cart });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Error al agregar producto al carrito" });
  }
});


router.get("/:cid", async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cartModel.findById(cid).populate('products.product').lean();
        
        if (!cart) {
            return res.render("pages/error", { message: "Carrito no existe" });
        }

        const total = cart.products.reduce((acc, item) => {
            const precio = item.product ? item.product.price : 0;
            return acc + (precio * item.quantity);
        }, 0);

        res.render("pages/carrito", { 
            cart, 
            total,       
            cartId: cid 
        }); 

    } catch (error) {
        console.error("Error en el render del carrito:", error);
        res.status(500).json({ message: "Error al obtener el carrito" });
    }
});


router.delete("/:cid/products/:pid", async (req, res) => {
try {
  const { cid, pid } = req.params;
  const cart = await cartModel.findByIdAndUpdate(cid,
  { $pull: { products: { product: pid } } },
  { new: true }
  );
  res.send({ status: "success", message: "Producto eliminado del carrito", payload: cart });
} catch (error) {
  res.status(500).json({ message: "Error al eliminar el producto del carrito" });
}
});


router.put("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const products = req.body;

    const cart = await cartModel.findByIdAndUpdate(cid, 
      { products: products },
      { new: true }
    );
    res.send({ status: "success", message: "Productos del carrito actualizados", payload: cart });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar los productos del carrito" });
  }
});


router.put("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    const cart = await cartModel.findOneAndUpdate(
      { _id: cid, 'products.product': pid },
      { $set: { 'products.$.quantity': quantity } },
      { new: true }
    );
    res.send({ status: "success", message: "Cantidad del producto actualizada", payload: cart });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar la cantidad del producto en el carrito" });
  }
});

router.delete("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await cartModel.findByIdAndUpdate(cid, 
      { products: [] },
      { new: true }
    );
    res.send({ status: "success", message: "Carrito vaciado", payload: cart });
  } catch (error) {
    res.status(500).json({ message: "Error al vaciar el carrito" });
  }
});


export default router;