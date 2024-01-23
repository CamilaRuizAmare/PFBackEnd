import express from 'express';
import cart from '../dao/mongo/db/Cart.dao.js';
import productManager from '../dao/mongo/db/ProductManager.dao.js';

const cartRouter = express.Router();

cartRouter.get('/', async (req, res) => {
    res.render('index', {
        layout: 'cart'
    });
});

//Crea un nuevo carrito

cartRouter.post('/', async (req, res) => {
    try {
        const newCart = await cart.addCart();
        res.status(201).json(newCart);
        console.log(newCart);
    }
    catch (err) {
        res.status(500).json({ "Error al conectar con el servidor": err.message });
    };

});

//Busca el carrito por ID.

cartRouter.get('/:cid', async (req, res) => {
    try {
        const cartID = req.params.cid;
        const cartByID = await cart.getCart(cartID);
        if (!cartByID) {
            res.status(404).json({ message: "Cart not found" });
        };
        const productsInCart = cartByID.products
        console.log(cartByID);
        console.log(productsInCart[0]._id);
        res.status(200).json(productsInCart);
    }
    catch (err) {
        res.status(500).json({ "Error al conectar con el servidor": err.message });
    };
});

//Busca el carrito y agrega un producto o incrementa su cantidad.

cartRouter.post('/:cid/product/:pid', async (req, res) => {
    try {
        const cartID = req.params.cid;
        const productID = req.params.pid;
        const cartByID = await cart.getCart(cartID);
        const productByID = await productManager.getProductById(productID);
        if (!cartByID || !productByID) {
            res.status(404).json({ message: "Cart or product not found" });
        }
        const validationProduct = cartByID.products.findIndex((p) => p._id === productID);
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
        res.status(500).json({ "Error al conectar con el servidor": err.message });
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

            console.log(idProduct, quantity);
            if (!idProduct || !quantity) {
                return res.status(404).json({ message: "Incomplete or invalid info" });
            }
            cartByID.products.push(newProduct);
        });
        const updateCart = await cart.updateCart(cartID, cartByID);
        return res.status(201).json(updateCart);

    }
    catch (err) {
        res.status(500).json({ "Error al conectar con el servidor": err.message });
    };
});

//Actualiza quantity del producto buscado en el carrito. Si no se envia cantidad, incrementa en 1.

cartRouter.put('/:cid/product/:pid', async (req, res) => {
    try {
        const cartID = req.params.cid;
        const productID = req.params.pid;
        const quantityReq = req.body.quantity;
        const cartByID = await cart.getCart(cartID);
        const productByID = await productManager.getProductById(productID);
        if (!cartByID || !productByID) {
            return res.status(404).json({ message: "Cart or product not found" });
        }
        const validationProduct = cartByID.products.findIndex((p) => p._id === productID);
        console.log(validationProduct, cartByID, quantityReq);
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
        res.status(500).json({ "Error al conectar con el servidor": err.message });
    }
});

//Busca el producto por ID dentro del carrito y lo borra

cartRouter.delete('/:cid/product/:pid', async (req, res) => {
    try {
        const cartID = req.params.cid;
        const productID = req.params.pid;
        const cartByID = await cart.getCart(cartID);
        const validationProduct = cartByID.products.findIndex((p) => p._id === productID);
        console.log(cartByID, productID, validationProduct, cartID);
        if (!cartByID || validationProduct === -1) {
            return res.status(404).json({ message: "Cart or product not found" });
        }
        const productDelete = cartByID.products[validationProduct];
        cartByID.products.splice(validationProduct, 1);
        const updateCart = await cart.updateCart(cartID, cartByID);
        return res.status(200).json({ 'Removed product': productDelete });
    }
    catch (err) {
        res.status(500).json({ "Error al conectar con el servidor": err.message });
    }
});

//Borra todos los productos del carrito

cartRouter.delete('/:cid', async (req, res) => {
    try {
        const cartID = req.params.cid;
        const cartByID = await cart.getCart(cartID);
        if (!cartByID) {
            return res.status(404).json({ message: "Cart not found" });
        }
        cartByID.products = [];
        const emptyCart = await cart.updateCart(cartID, cartByID);
        return res.status(200).json({ 'Removed products': emptyCart });
    }
    catch (err) {
        res.status(500).json({ "Error al conectar con el servidor": err.message });
    }
});


export { cartRouter };