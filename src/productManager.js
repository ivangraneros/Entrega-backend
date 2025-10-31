const fs = require('fs').promises;
const path = require('path');

const { v4: uuidv4 } = require('uuid');

const filePath = path.join(__dirname, "data", './data/products.json');

class ProductManager {
    constructor(filePath) {
        this.filePath = filePath;
    }   

    async #readFile() {
        try {
            const data = await fs.readFile(this.filePath, "utf8");
            return JSON.parse(data || "[]");
        } catch (error) {
            if (error.code === 'ENOENT') {
                await this.#writeFile([]);
                return [];
            } else {
                console.error("Error al leer archivo:", error);
            }
        }
    }

    async #writeFile(products) {
        try {
            await fs.writeFile(this.filePath, JSON.stringify(products, null, 2));
        } catch (error) {
            console.error("Error al escribir archivo:", error);
        }
    }

    async addProduct({title, description, code, price, status, stock, category, thumbnails}) {
        try {
            if (!title || !description || !code || !price || !status || !stock || !category) {
                throw new Error("Todos los campos son obligatorios");
            }
        
        const products = await this.#readFile();
        const newProduct = {
            id: uuidv4(),
            title,
            description,
            code,
            price,
            status,
            stock,
            category,
            thumbnails: thumbnails || []
        };
        products.push(newProduct);
        await this.#writeFile(products);
        return newProduct;
        } catch (error) {
            console.error("Error al agregar producto:", error);
            throw error;
        }
    }

    async getAllProducts() {
        try {
            const products = await this.#readFile();
            return products;
        } catch (error) {
            console.error("Error al obtener productos:", error);
        }
    }

    async getProductById(id) {
        try {
            const products = await this.#readFile();
            const producto = products.find(p => p.id === id || null);
            console.log("producto:",producto);
            if (!producto) {
                throw new Error("Producto no encontrado");
            }
            return producto;
        } catch (error) {
            console.error("Error al obtener producto:", error);
        }
    }

    async updateProductById(dataUpdateProduct, id) {
        try {
            const products = await this.#readFile();
            const searchProduct = products.find(p => p.id === id || null);
            if (!searchProduct) {
                throw new Error("Producto no encontrado");
            }
            const product = {
                ...searchProduct,
                dataUpdateProduct,
            };
        } catch (error) {
                console.error("Error al actualizar producto:", error);
            }
        }

        async deleteProductById(id) {
            try {
                const products = await this.#readFile();
                const deleteProducts = products.find(p => p.id !== id || null);
                if (deleteProducts === -1) return false;
                products.splice(deleteProducts, 1);
                await this.#writeFile(products);
                return true;
            } catch (error) {
                console.error("Error al eliminar producto:", error);
            }
        }
}

module.exports = ProductManager;

