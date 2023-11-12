import express from 'express';
import productManager from '../ProductManager.js';
import { uploader } from '../utils.js';
import io from '../app.js';

const realTimeRouter = express.Router();


realTimeRouter.get('/', async (req, res) => {
    const products = await productManager.getProducts();
    res.render('index', { products });
    io.on('connection', (socket) => {
        console.log('Cliente conectado');
        socket.on('prueba', (data) => {
            console.log(data);
        });
        socket.emit('products', products);
    });
  });

realTimeRouter.post('/', uploader.array('files'), async (req, res) => {
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

export default realTimeRouter;