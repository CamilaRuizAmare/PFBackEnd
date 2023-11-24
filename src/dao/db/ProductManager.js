import productModel from "../models/products.model.js";

class ProductManager {

    async getProducts() {
        const products = await productModel.find();
        return products;
    };

    async addProduct(newProduct) {
        const products = await productModel.find();
        const id = products.length === 0 ? 1 : products[products.length - 1].id + 1;
        const status = true;
        const product = {
            id,
            title: newProduct.title,
            price: newProduct.price,
            code: newProduct.code,
            description: newProduct.description,
            thumbnail: newProduct.thumbnail,
            stock: newProduct.stock,
            status
        };
        const productNew = new productModel(product);
        const productValidation = product.title != '' && product.description != '' && product.price != '' && product.code != '' && product.stock != ''
        if (productValidation) {
            const productSave = await productNew.save();
            return productSave;
        }
        else {
            return `El producto con código ${product.code} ya fue ingresado`
        };
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
