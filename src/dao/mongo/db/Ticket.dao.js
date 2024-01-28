import ticketModel from "../models/ticket.model.js";

class Ticket {
    constructor() { }

    async createTicket(infoTicket) {
        const newTicket = new ticketModel(infoTicket);
        await newTicket.save();
        return newTicket;
    }
};

const newTicket = new Ticket();
export default newTicket;