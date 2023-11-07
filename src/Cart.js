import fs from 'fs';

class Cart {
    constructor() {
        this.path = 'Cart.json';
    };

    async writeFile(cart) {
        await fs.promises.writeFile(this.path, JSON.stringify(cart), 'utf-8');
    };

    async readFile() {
        try {
            const readCarts = await fs.promises.readFile(this.path);
            const carts = JSON.parse(readCarts);
            return carts;
        }
        catch (error) {
            return [];
        }
    };

    async getCart(id) {
        const carts = await this.readFile();
        const idCart = carts.find(cart => cart.id === id);
        if (idCart) {
            return idCart;
        }
        else {
            return;
        };
    };

    
};



const cart = new Cart();
export default cart;