
export default class CartRepository {
    constructor(dao) {
        this.dao = dao;
    }

        async getCart(id) {
            const cart = await this.dao.getCartById(id);
            
            if (cart.error) {
            console.error("Error desde el DAO:", cart.error);
            return null;
        }
        
        return cart;
        }

        async createCart(cart) {
            const newCart = await this.dao.create(cart);
            return new cartDto(newCart);
        }

        async addProductToCart(cartId, productId) {
            return await this.dao.addProductToCart(cartId, productId);
        }
    }