import express from 'express';
import productManager from '../dao/fs/ProductManager.js';

const products = await productManager.getProducts();
const homeRouter = express.Router();

homeRouter.get('/', (req, res)=>{
    const home = 'home';
    res.render('index', {home, products});
});
export {products};
export default homeRouter;