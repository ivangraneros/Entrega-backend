export default class TicketRepository {
    constructor(dao) {
        this.dao = dao;
    }

    async create(ticket) {
        return await this.dao.create(ticket);
    }

    async getOne(id) {
        return await this.dao.getOne(id);
    }
}