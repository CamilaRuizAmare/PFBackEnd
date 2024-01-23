import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';

const collectionCarts = 'carts';
const cartsSchema = new mongoose.Schema({
    _id: { type: String, default: uuidv4() },
    products: [{
        _id: { type: String, ref: 'Products' },
        quantity: Number
    }]
});

const autoPopulateLead = function (next) {
    this.populate('products._id');
    next();
};

cartsSchema.pre('findOne', autoPopulateLead).pre('find', function (next) {
    this.populate('products._id'), next();
});

const cartModel = mongoose.model(collectionCarts, cartsSchema);
export default cartModel;