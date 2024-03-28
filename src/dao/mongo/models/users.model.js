import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const collectionUsers = 'users';
const userSchema = new mongoose.Schema({
    _id: {type: String, default: uuidv4()},
    first_name: String,
    last_name: String,
    email: { type: String, unique: true },
    age: Number,
    password: String,
    tokenRecoveryPass: String,
    dateToken: Date,
    role: { type: String, default: 'user' },
    cart: {
        _id: { type: String, ref: 'carts' },
        status: { type: String, default: 'open' }
    },
    documents: [
        {
            name: String,
            reference: String 
        }
    ],
    lastConection: {type: String}
});

const autoPopulateLead = function (next) {
    this.populate('cart._id');
    next();
};

userSchema.pre('save', autoPopulateLead).pre('find', function (next) {
    this.populate('cart._id'), next();
});

const userModel = mongoose.model(collectionUsers, userSchema);
export default userModel;