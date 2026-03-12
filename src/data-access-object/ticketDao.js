import ticketModel from "../models/ticket.model.js";

export default class TicketDao {
    async create(ticket) {
        return await ticketModel.create(ticket);
    }

    async getOne(id) {
        return await ticketModel.findById(id);
    }
}