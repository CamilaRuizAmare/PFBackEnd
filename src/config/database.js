import mongoose from 'mongoose';

const URL = 'mongodb+srv://ruizamarecamila:OpRcmgjc7egyNMgo@ecommerce.6lisixq.mongodb.net/?retryWrites=true&w=majority';
const db = mongoose.connection;
mongoose.connect(URL, {});

db.once('open', () => {
    console.log('Database connected');
});

export {mongoose, db};