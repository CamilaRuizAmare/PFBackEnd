import mongoose from 'mongoose';

const collectionUsers = 'users';
const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: {type: String, unique: true},
    age: Number,
    password: String,
    role: {type: String, default: 'user'},
    cart: [{
        _id: {type: String, unique: true, ref: 'carts'},
        status: {type: String, default: 'open'}
    }]
});

const userModel = mongoose.model(collectionUsers, userSchema);
export default userModel;