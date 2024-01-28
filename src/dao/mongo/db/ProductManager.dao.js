import productModel from "../models/products.model.js";

class ProductManager {
    constructor() { }

    async getProducts() {
        const products = await productModel.find();
        return products;
    };

    async addProduct(newProduct) {
        const productNew = new productModel(newProduct);
        const productSave = await productNew.save();
        return productSave;
    };

    async getProductById(id) {
        const product = await productModel.findById(id);
        if (product) {
            return product;
        }
        else {
            return;
        };
    };

    async updateProduct(id, newProduct) {
        const updateProduct = await productModel.findByIdAndUpdate(id, newProduct)
        if (!updateProduct) {
            return;
        } else {
            return updateProduct;
        };
    };

    async deleteProduct(id) {
        const deleteProduct = await productModel.findByIdAndDelete(id);
        if (!deleteProduct) {
            return;
        }
        else {
            return deleteProduct;
        };
    };


};

const productManager = new ProductManager();
export default productManager;
