import express from 'express';
import productManager from '../dao/db/ProductManager.js';

const products = await productManager.getProducts();
const homeRouter = express.Router();

homeRouter.get('/', (req, res) => {
    res.render('index', {
        layout: 'home',
    });
});



export {products};
export default homeRouter;