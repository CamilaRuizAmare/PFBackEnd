import mongoose from 'mongoose';
import 'dotenv/config.js';

const URL = process.env.mongoUrl;

const db = mongoose.connection;
mongoose.connect(URL, {});

db.once('open', () => {
    console.log('Database connected');
});

export {mongoose, db};