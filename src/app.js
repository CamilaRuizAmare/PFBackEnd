import express from 'express';
import { db } from './config/database.js';
import __dirname from "./utils.js";
import handlebars from "express-handlebars";
import {Server} from "socket.io";
import homeRouter from './routes/home.router.js'
import realTimeRouter from './routes/realtimeproducts.router.js';
import { productsRouter } from './routes/products.router.js';
import { cartRouter } from './routes/cart.router.js';
import productManager from './dao/db/ProductManager.js';
import messageModel from './dao/models/message.model.js';

const app = express();
const port = 8080;
const httpServer = app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

const io = new Server(httpServer);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use('/api/products', productsRouter);
app.use('/api/carts', cartRouter);
app.use('/', homeRouter);
app.use('/realtimeproducts', realTimeRouter);
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');


io.on('connection', async (socket) => {
    console.log('Cliente conectado');
    const products = await productManager.getProducts();
    socket.emit('products', products);
    socket.on('addProduct', async (data) => {
        try {
            const newProduct = await productManager.addProduct(data);
            const updateProducts = await productManager.getProducts();
            io.emit('products', updateProducts);
        } catch (error) {
            console.log(error.message);
        }
    });
    socket.on('deleteProduct', async (data) => {
        try {
        const idDeleted = await productManager.deleteProduct(data);
        const updateProducts = await productManager.getProducts();
        io.emit('products', updateProducts);
        console.log(idDeleted);
        io.emit('idDeleted', idDeleted);
    }
    catch(err) {
        console.log('Error: ', err)
    }
    }); 
    const messages = await messageModel.find();
    socket.emit('messages', messages);
    socket.on('newMessage', async (data) => {
        try {
        const newMessage = new messageModel(data);
        await newMessage.save();
        const messages = await messageModel.find();
        socket.emit('messages', messages);
    }
    catch (err) {
        console.log('Error: ', err)
    }
    })
});

export default io;