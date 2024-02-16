import express from 'express';
import { passportCall, authorizationUser } from '../utils.js';
import productManager from '../dao/mongo/db/ProductManager.dao.js';

const editProductsRouter = express.Router();

editProductsRouter.get('/', passportCall('jwt'), authorizationUser('Admin', 'Premium'), async (req, res) => {
    const products = await productManager.getProducts();
    res.render('index', {
        layout: 'realTimeProducts',
        products,
        profileUser: req.user.user,
    });
});

export default editProductsRouter;