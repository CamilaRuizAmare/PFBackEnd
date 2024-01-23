import cartModel from "../models/carts.model.js";

class Cart {
    constructor(){}
    
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

    /* async deleteItemToCart(idCart, idItem) {
        const ItemsTocart = await cartModel.findById(idCart).products
    } */

    
};



const cart = new Cart();
export default cart;