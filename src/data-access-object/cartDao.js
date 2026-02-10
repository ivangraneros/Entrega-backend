import Cart from "../models/cart.model.js"; 
import mongoose from 'mongoose';


class CartManager {

    async getCarts() {
    try {
        return await Cart.find().populate('products.product').lean();
    } catch (error) {
        throw new Error("Error al obtener los carritos: " + error.message);
    }
}

    async createCart() {
        try {
            const newCart = new Cart({ products: [] });
            await newCart.save();
            return newCart;
        } catch (error) {
            throw new Error('Error al crear el carrito: ' + error.message);
        }
    }

   async getCartById(cartId) {
    try {

        if (!mongoose.Types.ObjectId.isValid(cartId)) {
            return { error: "Formato de ID de carrito inválido" };
        }

        const foundCart = await Cart.findById(cartId).populate('products.product').lean();
        
        if (!foundCart) return { error: "El carrito no existe" };
        
        return foundCart;
    } catch (error) {

        console.error("Error detallado:", error); 
        throw error;
    }
}


    async updateCartProducts(cartId, updateData) {
        try {
            const updatedCart = await Cart.findByIdAndUpdate(cartId, updateData, { new: true }).populate('products.product').lean();
            return updatedCart;
        } catch (error) {
            throw error;
        }
    }

    async addProductToCart(cartId, productId) {
        try {
            const cartToUpdate = await Cart.findById(cartId);
            if (!cartToUpdate) throw new Error('No se encontró el carrito');

            const productIndex = cartToUpdate.products.findIndex(
                p => p.product.toString() === productId
            );

            if (productIndex !== -1) {

                cartToUpdate.products[productIndex].quantity += 1;
            } else {

                cartToUpdate.products.push({ product: productId, quantity: 1 });
            }

            await cartToUpdate.save();
            return cartToUpdate;
        } catch (error) {
            throw error;
        }
    }
}

export default CartManager;