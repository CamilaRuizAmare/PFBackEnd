import mongoose from 'mongoose';
import config from './env.config.js'

const URL = config.dbUrl;

const db = mongoose.connection;
mongoose.connect(URL, {});

db.once('open', () => {
    console.log('Database connected');
});

export {mongoose, db};