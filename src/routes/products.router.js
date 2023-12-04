import express from 'express';
import productManager from '../dao/db/ProductManager.js';
import productModel from "../dao/models/products.model.js";
import { uploader } from '../utils.js';
const productsRouter = express.Router();

productsRouter.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const query = req.query;
        const sort = parseInt(req.query.sort) || 0;
        console.log(sort, query)
        const products = await productModel.paginate(query, {page: page, limit: limit, sort: ({price: -1})});
        console.log(products);
        //const url = `api/products/&${{query}}=${query.query}&limit=${limit}&page=${page}&sort=${sort}`;
        return res.status(200).json(products);
        
    }
    catch (err) {
        res.status(500).json({ "Error al conectar con el servidor": err.message });
    }
    
});

productsRouter.get('/:pid', async (req, res) => {
    try {
        const productID = req.params.pid;
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
            thumbnail: req.files,
            category: req.body.category
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
        const productID = req.params.pid;
        const productByID = await productManager.updateProduct(productID);
        if (!productByID) {
            res.status(404).json({ message: "Product not found" });
        } else {
        res.status(201).json(productByID);
        };
    }
    catch (err) {
        res.status(500).json({ "Error al conectar con el servidor": err.message });
    };
});

productsRouter.delete('/:pid', async (req, res) => {
    try {
        const productID = req.params.pid;
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
