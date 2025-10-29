const fs = require('fs');
const path = require('path');

const { v4: uuidv4 } = require('uuid');

const filePath = path.join(__dirname, "data", 'data/carts.json');

class CartManager {
    constructor(filePath) {
        this.filePath = filePath;
    }   

    async #readFile() {
        try {
            const data = await fs.readFileSync(this.filePath, "utf8");
            return JSON.parse(data)
        } catch (error) {
            if (error.code === 'ENOENT') {
                await this.#writeFile([]);
                return [];
            }
        }
    }

    async #writeFile(data) {
        try {
            await fs.writeFileSync(this.filePath, JSON.stringify(products, null, 2));
        } catch (error) {
            console.error("Error al escribir archivo:", error);
        }
    }

    async createCart() {
        const carts = await this.#readFile();
        const newCart = {
            id: uuidv4(),
            products: []
        };
        carts.push(newCart);
        await this.#writeFile(carts);
        return newCart;
    }

    async getCartById(id) {
        try {
            const carts = await this.#readFile();
            const cart = carts.find(c => c.id === id || null);
        } catch (error) {
            console.error("Error al obtener carrito:", error);
        }
    }

        async addProductToCart(cartId, productId) {
            try {
                const carts = await this.#readFile();
                const cart = carts.find(c => c.id === cartId || null);
                if (cart === -1) 
                    return null;

                const productInCart = cart.products.find(p => p.productId === productId);
                if (productInCart) {
                    productInCart.quantity += 1;
                } else {    
                    cart.products.push({ productId, quantity: 1 });
                }
                await this.#writeFile(carts);
                return cart;
            } catch (error) {
                console.error("Error al agregar producto al carrito:", error);
            }

    }
}

module.exports = CartManager;
