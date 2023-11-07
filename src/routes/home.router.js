import express from 'express';
import productManager from '../ProductManager.js';

const products = await productManager.getProducts();
const homeRouter = express.Router();

homeRouter.get('/', (req, res)=>{
    res.render('index', {products});
});
export {products};
export default homeRouter;