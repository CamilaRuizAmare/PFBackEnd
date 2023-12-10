import mongoose from 'mongoose';

const collectionUsers = 'users';
const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: {type: String, unique: true},
    age: Number,
    password: String,
    profile: {type: String, default: 'usuario'}
});

const userModel = mongoose.model(collectionUsers, userSchema);
export default userModel;