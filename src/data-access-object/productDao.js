const Product = require("../models/products.model");
const mongoose = require('mongoose');


class ProductManager {

async getAllProducts({ limit = 5, page = 1, sort, query }) {
    const pageNumber = parseInt(page) || 1; 

    let filter = {};
    if (query) {
        if (query === 'true' || query === 'false') {
            filter = { stock: query === 'true' ? { $gt: 0 } : { $eq: 0 } };
        } else {
            filter = { category: query };
        }
    }

    let options = {
        page: pageNumber,
        limit: parseInt(limit) || 10,
        lean: true
    };

    if (sort) options.sort = { price: sort === 'asc' ? 1 : -1 };

    try {
    const result = await Product.paginate(filter, options);

    return {
        docs: result.docs,
        status: "success",
        payload: result.docs,
        totalPages: result.totalPages,
        prevPage: result.prevPage,
        nextPage: result.nextPage,
        page: result.page,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
    };
    } catch (error) {
        throw new Error("Error al obtener productos desde el DAO: " + error.message);
    }
}
    async getProductById(productId) {
        try {
            const foundProduct = await Product.findById(productId);
            return foundProduct;
        } catch (error) {
            throw error;
        }
    }

    async createProduct(productData) {
        try {
            const newProduct = new Product(productData);
            await newProduct.save();
            return newProduct;
        } catch (error) {
            throw error;
        }
    }

    async updateProduct(productId, updateData) {
        try {
            const updatedProduct = await Product.findByIdAndUpdate(
                productId,
                updateData,
                { new: true }
            );
            return updatedProduct;
        } catch (error) {
            throw error;
        }
    }

    async deleteProductById(_Id) {
        try {
            const deletedProduct = await Product.findByIdAndDelete(_Id);
            return deletedProduct;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = ProductManager;