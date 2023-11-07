import express from 'express';
import cart from '../Cart.js';
import productManager from '../ProductManager.js';
const cartRouter = express.Router();

cartRouter.post('/', async (req, res) => {
    try {
        const fileCart = await cart.readFile();
        const id = fileCart.length === 0 ? 1 : fileCart[fileCart.length - 1].id + 1;
        const cartID = {
            id,
            products: [],
        };
        fileCart.push(cartID);
        await cart.writeFile(fileCart);
        res.status(201).json(cartID);
        console.log(fileCart);
    }
    catch (err) {
        res.status(500).json({ "Error al conectar con el servidor": err.message });
    };

});

cartRouter.get('/:cid', async (req, res) => {
    try {
        const cartID = parseInt(req.params.cid, 10);
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
        const cartID = parseInt(req.params.cid, 10);
        const productID = parseInt(req.params.pid, 10);
        const cartByID = await cart.getCart(cartID);
        if (!cartByID) {
            res.status(404).json({ message: "Cart not found" });
        } else {
            const productByID = await productManager.getProductById(productID);
            if (!productByID) {
                res.status(404).json({ message: "Product not found" });
            } else {
                const validationProduct = cartByID.products.find(p => p.id === productByID.id);
                if (validationProduct) {
                    validationProduct.quantity = validationProduct.quantity + 1;
                } else {
                    const productInCart = {
                        id: productByID.id,
                        quantity: 1
                    };
                    cartByID.products.push(productInCart);
                };
                const allCarts = await cart.readFile();
                const updatedCarts = allCarts.map((cart) => {
                    if (cart.id === cartID) {
                        return cartByID;
                    }
                    return cart;
                });
                await cart.writeFile(updatedCarts);
                res.status(201).json(cartByID);
            }
        }
    }
    catch (err) {
        res.status(500).json({ "Error al conectar con el servidor": err.message });
    }
});

export { cartRouter };