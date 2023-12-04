import express from 'express';
import productManager from '../dao/db/ProductManager.js';

const products = await productManager.getProducts();
const homeRouter = express.Router();

homeRouter.get('/', (req, res) => {
    res.render('home');
    console.log(products);
});



export {products};
export default homeRouter;