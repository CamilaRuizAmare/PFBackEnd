import express from 'express';
import productManager from '../../mongo/db/ProductManager.dao.js';

const editProductsRouter = express.Router();

editProductsRouter.get('/', async (req, res) => {
    const products = await productManager.getProducts();
    res.render('index', {
        layout: 'realTimeProducts',
        products,
        profileUser: req.session.user})
    });

export default editProductsRouter;