import cartModel from "../models/carts.model.js";

class Cart {
    async getCarts() {
            const readCarts = await cartModel.find();
            return readCarts;
    };

    async getCart(id) {
        const cart = await cartModel.findById(id);
        if (!cart) {
            return;
        }
        else {
            return cart;
        };
    };

    async addCart() {
        const cart = {
            products: []
        };
        const newCart = new cartModel(cart);
        const cartSave = await newCart.save();
        return cartSave;
    };

    async updateCart(idCart, newCart) {
        const updateCart = await cartModel.findByIdAndUpdate(idCart, newCart, {new: true});
        
        if(!updateCart) {
            return;
        }
        else {
            return updateCart;
        }


    };

    async deleteCart(id) {
        const deleteCart = await cartModel.findByIdAndDelete(id);
        if (!deleteCart) {
            return; 
        }
        else {
            return deleteCart;
        };
    };

    
};



const cart = new Cart();
export default cart;