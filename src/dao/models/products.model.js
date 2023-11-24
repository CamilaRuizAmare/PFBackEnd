import mongoose from "mongoose";

const collectionProducts = 'products';
const productSchema = new mongoose.Schema({
    id: Number,
    title: String,
    price: Number,
    code: {
        type: String,
        unique: true,
    },
    description: String,
    thumbnail: String,
    stock: Number,
    status: Boolean
});

const productModel = mongoose.model(collectionProducts, productSchema);
export default productModel;