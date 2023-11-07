import express from 'express';
import productManager from '../ProductManager.js';
import { uploader } from '../utils.js';
const productsRouter = express.Router();

productsRouter.get('/', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        const limitProducts = parseInt(req.query.limit);
        if (limitProducts) {
            const limitedInfo = products.slice(0, limitProducts);
            return res.status(200).json(limitedInfo);
        }
        res.status(200).json(products);
    }
    catch (err) {
        res.status(500).json({ "Error al conectar con el servidor": err.message });
    }
});

productsRouter.get('/:pid', async (req, res) => {
    try {
        const productID = parseInt(req.params.pid, 10);
        const productByID = await productManager.getProductById(productID);
        if (!productByID) {
            res.status(404).json({ message: "Product not found" });
        };
        res.status(200).json(productByID);
    }
    catch (err) {
        res.status(500).json({ "Error al conectar con el servidor": err.message });
    }
});

productsRouter.post('/', uploader.array('files'), async (req, res) => {
    try {
        const newProduct = {
            title: req.body.title,
            description: req.body.description,
            price: req.body.price,
            stock: req.body.stock,
            code: req.body.code,
            thumbnail: req.files
        };
        await productManager.addProduct(newProduct);
        res.status(201).json(newProduct);
    }
    catch (err) {
        res.status(500).json({ "Error al conectar con el servidor": err.message });
    }
});

productsRouter.put('/:pid', uploader.array('files'), async (req, res) => {
    try {
        const productID = parseInt(req.params.pid, 10);
        const productByID = await productManager.getProductById(productID);
        const thumbnail = req.files.length > 0 ? req.files : productByID.thumbnail;
        if (!productByID) {
            res.status(404).json({ message: "Product not found" });
        } else {
        const productUpdate = {
            title: req.body.title || productByID.title,
            description: req.body.description || productByID.description,
            price: req.body.price || productByID.price,
            stock: req.body.stock || productByID.stock,
            code: req.body.code || productByID.code,
            thumbnail: thumbnail
        };
        await productManager.updateProduct(productID, productUpdate);
        res.status(201).json(productUpdate);
        };
    }
    catch (err) {
        res.status(500).json({ "Error al conectar con el servidor": err.message });
    };
});

productsRouter.delete('/:pid', async (req, res) => {
    try {
        const productID = parseInt(req.params.pid, 10);
        const productByID = await productManager.deleteProduct(productID);
        if (!productByID) {
            res.status(404).json({ message: "Product not found" });
        };
        res.status(200).json({"Deleted product:": productByID});
    }
    catch (err) {
        res.status(500).json({ "Error al conectar con el servidor": err.message });
    }
});

export { productsRouter };
