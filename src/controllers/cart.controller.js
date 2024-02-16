import express from 'express';
import cart from '../dao/mongo/db/Cart.dao.js';
import productManager from '../dao/mongo/db/ProductManager.dao.js';
import newTicket from '../dao/mongo/db/Ticket.dao.js';
import config from '../config/env.config.js'
import { passportCall, transport } from '../utils.js';

const cartRouter = express.Router();

cartRouter.get('/', passportCall('jwt'), async (req, res) => {
    res.render('index', {
        layout: 'cart',
        user: req.user.user
    });
});

//Crea un nuevo carrito

cartRouter.post('/', async (req, res) => {
    try {
        const newCart = await cart.addCart();
        res.status(201).json(newCart);
        req.logger.INFO(newCart);
    }
    catch (err) {
        req.logger.ERROR(err);
        res.status(500).json({ "Internal Server Error": err.message });
    };

});

//Busca el carrito por ID.

cartRouter.get('/:cid', passportCall('jwt'), async (req, res) => {
    try {
        const cartID = req.params.cid;
        const cartByID = await cart.getCart(cartID);
        if (!cartByID) {
            req.logger.WARNING('Cart not found');
            res.status(404).json({ message: "Cart not found" });
        };
        const productsInCart = cartByID.products
        req.logger.INFO(cartByID);
        res.status(200).render("index", {
            layout: 'cart',
            dataUser: req.user,
            productsInCart,
        })
        /* res.status(200).json(productsInCart); */
    }
    catch (err) {
        req.logger.ERROR(err);
        res.status(500).json({ "Internal Server Error": err.message });
    };
});

cartRouter.post('/:cid/purchase', passportCall('jwt'), async (req, res) => {
    try {
        const cartID = req.params.cid;
        const cartByID = await cart.getCart(cartID);
        if (!cartByID) {
            req.logger.WARNING('Cart not found');
            res.status(404).json({ message: "Cart not found" });
        };
        const productsInCart = cartByID.products
        if (productsInCart) {
            let amount = 0
            let purchasedProducts = [];
            let productsOut = [];
            for (const product of productsInCart) {
                const productStock = await productManager.getProductById(product._id);
                if (product.quantity <= productStock.stock) {
                    productManager.updateProduct(product._id, { stock: (productStock.stock - product.quantity) });
                    amount += (product.quantity * product._id.price);
                    req.logger.INFO('precio', amount, productStock.stock, product.quantity);
                    purchasedProducts.push(product);
                    const validationProduct = cartByID.products.findIndex((p) => p._id === product._id);
                    cartByID.products.splice(validationProduct, 1);
                    await cart.updateCart(cartID, cartByID);
                }
                else {
                    productsOut.push(product)
                }
            }
            if (purchasedProducts.length > 0) {
                const ticketNew = {
                    purchase_datetime: new Date().toString(),
                    amount: amount,
                    purcharser: req.user.user.email,
                }
                const ticketOK = await newTicket.createTicket(ticketNew);
                const html = `
                     <html>
                         <div>
                            <h3>${req.user.user.first_name}, tu compra fué realizada</h3>
                            <p> Los detalles de tu compra son: 
                            ${ticketOK}</p>
                            <h4>Recordá tener tu N° de compra al momento de recibir o retirar el pedido!</h4>
                        </div>
                    </html>
                    `;
                const infoUser = {
                    from: config.mailUser,
                    to: req.user.user.email,
                    subject: `Tu compra N° ${ticketOK.code} ha sido realizada`,
                    html
                };
                const sendMail = await transport.sendMail(infoUser);
                res.status(201).json({ 'Purchased products': sendMail, 'Products In Cart': cartByID })
            } else {
                req.logger.WARNING('The products you are trying to buy do not have available stock');
                res.status(409).json({ 'The products you are trying to buy do not have available stock': productsOut })
            }
        }
    } catch (err) {
        req.logger.ERROR(err);
        res.status(500).json({ "Internal Server Error": err.message });
    }
});

//Busca el carrito y agrega un producto o incrementa su cantidad.

cartRouter.post('/:cid/product/:pid', passportCall('jwt'),  async (req, res) => {
    try {
        const cartID = req.params.cid;
        const productID = req.params.pid;
        const cartByID = await cart.getCart(cartID);
        const productByID = await productManager.getProductById(productID);
        const user = req.user.user.email;
        req.logger.DEBUG(productByID.owner, user)
        if (!cartByID || !productByID) {
            req.logger.WARNING('Cart or product not found');
            return res.status(404).json({ message: "Cart or product not found" });
        }
        if(productByID.owner === user) {
           return req.logger.WARNING('You cannot add your own products')
        }
        req.logger.DEBUG(req.user.user.email);
        const validationProduct = cartByID.products.findIndex((p) => p._id._id === productID);
        if (validationProduct === -1) {
            const newProduct = {
                _id: productID,
                quantity: 1
            };
            cartByID.products.push(newProduct);
            const updateCart = await cart.updateCart(cartID, cartByID);
            return res.status(201).json(updateCart);
        }
        cartByID.products[validationProduct].quantity += 1;
        const updateCart = await cart.updateCart(cartID, cartByID);
        return res.status(201).json(updateCart);
    }
    catch (err) {
        req.logger.ERROR(err);
        res.status(500).json({ "Internal Server Error": err.message });
    }
});

// Busca el carrito y lo actualiza completo con lo enviado en el req.body. 

cartRouter.put('/:cid', async (req, res) => {
    try {
        const cartID = req.params.cid;
        const cartByID = await cart.getCart(cartID);
        req.body.forEach((product) => {
            const idProduct = product._id;
            const quantity = product.quantity;
            const newProduct = { idProduct, quantity }
            req.logger.INFO(idProduct, quantity);
            if (!idProduct || !quantity) {
                req.logger.WARNING('Incomplete info');
                return res.status(404).json({ message: "Incomplete or invalid info" });
            }
            cartByID.products.push(newProduct);
        });
        const updateCart = await cart.updateCart(cartID, cartByID);
        return res.status(201).json(updateCart);

    }
    catch (err) {
        req.logger.ERROR(err);
        res.status(500).json({ "Internal Server Error": err.message }); res.status(500).json({ "Error al conectar con el servidor": err.message });
    };
});

//Actualiza quantity del producto buscado en el carrito. Si no se envia cantidad, incrementa en 1.

cartRouter.put('/:cid/product/:pid', passportCall('jwt'), async (req, res) => {
    try {
        const cartID = req.params.cid;
        const productID = req.params.pid;
        const quantityReq = req.body.quantity;
        const cartByID = await cart.getCart(cartID);
        const productByID = await productManager.getProductById(productID);
        const user = req.user.user.role;
        if (!cartByID || !productByID) {
            req.logger.WARNING('Cart or product not found');
            return res.status(404).json({ message: "Cart or product not found" });
        }
        if(productByID.owner === user) {
            req.logger.WARNING('You cannot add your own products')
        }
        const validationProduct = cartByID.products.findIndex((p) => p._id === productID);
        req.logger.INFO(validationProduct, cartByID, quantityReq);
        if (validationProduct === -1) {
            const newProduct = {
                _id: productID,
                quantity: quantityReq ? quantityReq : 1
            };
            cartByID.products.push(newProduct);
            const updateCart = await cart.updateCart(cartID, cartByID);
            return res.status(201).json(updateCart);
        }
        cartByID.products[validationProduct].quantity += quantityReq ? quantityReq : 1
        const updateCart = await cart.updateCart(cartID, cartByID);
        return res.status(201).json(updateCart);
    }
    catch (err) {
        req.logger.ERROR(err);
        res.status(500).json({ "Internal Server Error": err.message });
    }
});

//Busca el producto por ID dentro del carrito y lo borra

cartRouter.delete('/:cid/product/:pid', async (req, res) => {
    try {
        const cartID = req.params.cid;
        const productID = req.params.pid;
        const cartByID = await cart.getCart(cartID);
        const validationProduct = cartByID.products.findIndex((p) => p._id === productID);
        if (!cartByID || validationProduct === -1) {
            req.logger.WARNING('Cart or product not found');
            return res.status(404).json({ message: "Cart or product not found" });
        }
        const productDelete = cartByID.products[validationProduct];
        cartByID.products.splice(validationProduct, 1);
        const updateCart = await cart.updateCart(cartID, cartByID);
        return res.status(200).json({ 'Removed product': productDelete });
    }
    catch (err) {
        req.logger.ERROR(err);
        res.status(500).json({ "Internal Server Error": err.message });
    }
});

//Borra todos los productos del carrito

cartRouter.delete('/:cid', async (req, res) => {
    try {
        const cartID = req.params.cid;
        const cartByID = await cart.getCart(cartID);
        if (!cartByID) {
            req.logger.WARNING('Cart not found');
            return res.status(404).json({ message: "Cart not found" });
        }
        cartByID.products = [];
        const emptyCart = await cart.updateCart(cartID, cartByID);
        return res.status(200).json({ 'Removed products': emptyCart });
    }
    catch (err) {
        req.logger.ERROR(err);
        res.status(500).json({ "Internal Server Error": err.message });
    }
});


export { cartRouter };