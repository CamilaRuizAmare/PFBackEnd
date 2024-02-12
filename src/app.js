import express from 'express';
import compression from 'express-compression';
import { db } from './config/database.config.js';
import __dirname from "./utils.js";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import passport from 'passport';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import initPassport from './config/passport.config.js';
import config from './config/env.config.js'
import routerGral from './routes/router.js';
import addLogger from './middlewares/loggers/loggers.js'
import productManager from './dao/mongo/db/ProductManager.dao.js';
import messageModel from './dao/mongo/models/message.model.js';
import handlerError from './middlewares/errorControl/handler.error.js';

const app = express();
const port = config.port;
const httpServer = app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

const io = new Server(httpServer);

const hbs = handlebars.create({
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
        allowedProtoMethods: true,

    },
});

app.use(cookieParser());
initPassport();
app.use(compression({
    broli:{enable:true,zlib:{}}
}))
app.use(passport.initialize());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(cors());
app.use(handlerError);
app.use(addLogger);
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

routerGral(app);

io.on('connection', async (socket) => {
    req.logger.INFO('Cliente conectado');
    const products = await productManager.getProducts();
    socket.emit('products', products);
    socket.on('addProduct', async (data) => {
        try {
            const newProduct = await productManager.addProduct(data);
            const updateProducts = await productManager.getProducts();
            io.emit('products', updateProducts);
        } catch (error) {
            req.logger.ERROR(error.message);
        }
    });
    socket.on('deleteProduct', async (data) => {
        try {
            const idDeleted = await productManager.deleteProduct(data);
            const updateProducts = await productManager.getProducts();
            io.emit('products', updateProducts);
            req.logger.INFO(idDeleted);
            io.emit('idDeleted', idDeleted);
        }
        catch (err) {
            req.logger.ERROR('Error: ', err)
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
            req.logger.ERROR('Error: ', err)
        }
    })
});

export default io;