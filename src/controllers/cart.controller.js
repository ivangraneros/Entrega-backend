import { cartRepository, productRepository, ticketRepository } from "../repositories/index.js";

class CartController {

    getCart = async (req, res) => {
        try {
            const cart = await cartRepository.getCart(req.params.cid)
            res.send({ status: "success", payload: cart })
        } catch (error) {
            res.status(500).send({ error: error.message })
        }   
    }

    agregarProducto = async (req, res) => {
        try {
            const { cid, pid } = req.params;
            const result = await cartRepository.addProductToCart(cid, pid);
            res.send({ status: "success", payload: result });
        } catch (error) {
            res.status(500).send({ error: error.message });
        }
    }


    purchase = async (req, res) => {
        try {
            const { cid } = req.params;
            const cart = await cartRepository.getCart(cid);

        const products = cart?.products || cart?._doc?.products || cart?.payload?.products;

        if (!products || !Array.isArray(products)) {
            return res.status(400).send({ 
                error: "El carrito no tiene productos o la estructura es inválida",
                debug: cart 
            });
        }

        let totalAmount = 0;
        const productoSinStock = [];

        for (const item of cart.products) {

            const productId = item.product._id || item.product;
            
            if (!productId) {
                console.log("Item sin ID de producto:", item);
                continue;
            }

                const product = await productRepository.getProductById(productId);

                if (product && product.stock >= item.quantity) {
                    
                    totalAmount += product.price * item.quantity;
                    
                    await productRepository.updateProduct(productId, { stock: product.stock - item.quantity });

                    ;

                } else {
                    productoSinStock.push(product ? product.title : "Producto no encontrado");
                }
        }

            if (totalAmount > 0) {
                const ticketData = {
                code: `TCKT-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
                purchase_datetime: new Date(),
                amount: totalAmount,
                purchaser: req.user ? req.user.email : "anonimo@test.com"
            };

            const newTicket = await ticketRepository.create(ticketData);
            
            return res.send({ 
                status: "success", 
                ticket: newTicket,
                productoSinStock 
            });

             } else {
                return res.status(400).send({ status: "error", message: "No se pudo completar la compra. Productos sin stock: " + productoSinStock.join(", ") });
            }

            } catch (error) {
                res.status(500).send({ error: error.message });
            
        }
    }
}

export default new CartController();
        