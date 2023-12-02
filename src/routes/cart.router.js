import express from 'express';
import cart from '../dao/db/Cart.js';
import productManager from '../dao/db/ProductManager.js';
import cartModel from '../dao/models/carts.model.js';
const cartRouter = express.Router();

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

cartRouter.get('/:cid', async (req, res) => {
    try {
        const cartID = req.params.cid;
        const cartByID = await cart.getCart(cartID);
        if (!cartByID) {
            res.status(404).json({ message: "Cart not found" });
        };
        res.status(200).json(cartByID);
    }
    catch (err) {
        res.status(500).json({ "Error al conectar con el servidor": err.message });
    };
});

cartRouter.post('/:cid/product/:pid', async (req, res) => {
    try {
        const cartID = req.params.cid;
        const productID = req.params.pid;
        const cartByID = await cart.getCart(cartID);
        const productByID = await productManager.getProductById(productID);
        if (!cartByID || !productByID) {
            res.status(404).json({ message: "Cart or product not found" });
        }
        const validationProduct = cartByID.products.findIndex((p) => String(p._id) === productID);
        //const validationProduct = cartByID.products.findIndex(p => p._id === productID);
        console.log(validationProduct);
        if (validationProduct === -1) {
            const newProduct = {
                _id: productID,
                quantity: 1
            };
            cartByID.products.push(newProduct);
            const updateCart = await cart.updateCart(cartID,cartByID);
            return res.status(201).json(updateCart);
        } 
            cartByID.products[validationProduct].quantity += 1;
            const updateCart = await cart.updateCart(cartID,cartByID);
            return res.status(201).json(updateCart);
    }
    catch (err) {
    res.status(500).json({ "Error al conectar con el servidor": err.message });
}
});

export { cartRouter };