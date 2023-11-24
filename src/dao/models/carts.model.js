import mongoose from "mongoose";
const { Schema } = mongoose;

const collectionCarts = 'carts';
const cartsSchema = new mongoose.Schema({
    id: Number,
    products: [{
        idProduct: {
            type: Schema.Types.ObjectId, ref: 'products',
            unique: true
        },
        quantity: Number
    }]
});

const cartModel = mongoose.model(collectionCarts, cartsSchema);
export default cartModel;