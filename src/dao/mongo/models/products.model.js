import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';
import { v4 as uuidv4 } from 'uuid';


const collectionProducts = 'Products';
const productSchema = new mongoose.Schema({
    _id: {type: String, default: uuidv4()},
    title: String,
    price: Number,
    code: {
        type: String,
        unique: true,
    },
    description: String,
    thumbnail: String,
    category: String,
    stock: Number,
    status: {type: Boolean, default: true},
    owner: String,
});

productSchema.plugin(mongoosePaginate);

const productModel = mongoose.model(collectionProducts, productSchema);
export default productModel;