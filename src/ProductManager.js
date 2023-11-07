import fs from 'fs';

class ProductManager {
    constructor() {
        this.path = 'Products.json';
    };

    async writeFile(products) {
        await fs.promises.writeFile(this.path, JSON.stringify(products), 'utf-8');
    };

    async readFile() {
        try {
            const infoProduct = await fs.promises.readFile(this.path);
            const products = JSON.parse(infoProduct);
            return products;
        }
        catch (error) {
            return [];
        }
    };

    async addProduct(newProduct) {
            const file = await this.readFile();
            const id = file.length === 0 ? 1 : file[file.length - 1].id + 1;
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
            const codeValidation = file.find(data => data.code === newProduct.code);
            const productValidation = product.title != '' && product.description != '' && product.price != '' && product.code != '' && product.stock != ''
            if (!codeValidation && productValidation) {
                file.push(product);
                await this.writeFile(file);
                return product;
            }
            else {
                return `El producto con código ${product.code} ya fue ingresado`
            };
    };

    async getProducts() {
        
            const products = await this.readFile();
            return products;
    };

    async getProductById(id) {
            const products = await this.readFile();
            const idProduct = products.find(product => product.id === id);
            if (idProduct) {
                return idProduct;
            }
            else {
                return;
            };
    };

    async updateProduct(id, newProduct) {
            const products = await this.readFile();
            const productIndex = products.findIndex(product => product.id === id);
            if (productIndex !== -1) {
                const updatedProduct = {
                    ...products[productIndex],
                    ...newProduct
                };
                products[productIndex] = updatedProduct;
                await this.writeFile(products);
                return updatedProduct;
            } else {
                return;
            };
    };

    async deleteProduct(id) {
            const products = await this.readFile();
            const productIndex = products.findIndex(product => product.id === id);
            if (productIndex !== -1) {
                const deleteProduct = products.splice(productIndex, 1);
                await this.writeFile(products);
                return deleteProduct;
            }
            else {
                return;
            };
    };


};

const productManager = new ProductManager();
export default productManager;
