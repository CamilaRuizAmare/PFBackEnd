import express from 'express';
import generateProducts from '../utils/mock.utils.js';
import {passportCall} from '../utils.js';

const mockingRouter = express.Router();

mockingRouter.get('/', passportCall('jwt'), (req, res) => {
    
    const products = [];
    for (let i = 0; i < 100; i++) {
        products.push(generateProducts());
    }
    res.status(200).render('index', {
        layout: 'mockingProducts',
        dataUser: req.user.user,
        products
    })
});

export default mockingRouter;