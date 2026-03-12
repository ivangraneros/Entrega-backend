
export default class ProductRepository {
    constructor(dao) {
        this.dao = dao;
    }

        async getProducts() {
            return await this.dao.getAllProducts();
            
        }

        async getProductById(id) {
            return await this.dao.getProductById(id);
        }

        async createProduct(product) {
            const newProduct = await this.dao.createProduct(product);
            return newProduct;
        }

        async updateProduct(id, product) {
            return await this.dao.updateProduct(id, product);
        }

        async deleteProductById(id) {
            return await this.dao.deleteProductById(id);
        }
    }