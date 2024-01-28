import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const collectionTickets = 'tickets';
const ticketSchema = new mongoose.Schema({
    _id: {type: String, default: uuidv4()},
    code: {type: String, default:uuidv4()},
    purchase_datetime: Date,
    amount: Number,
    purcharser: String, //Ver si hay que referenciarlo!
});

const ticketModel = mongoose.model(collectionTickets, ticketSchema);
export default ticketModel;