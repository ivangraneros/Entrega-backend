import userDTO from '../dto/user.dto.js';
import userModel from '../models/user.model.js';

export default class UserRepository {
    constructor(dao) {
        this.dao = dao;
    }

    async getUser(email) {
        const user = await this.dao.getOne({ email });
        return user;
    }

    async getCurrentUser(user) {
        return new userDTO(user);
    }

    async createUser(user) {
        const newUser = await this.dao.create(user);
        return new userDTO(newUser);
    }

    async getUserWithPassword(email) {
        const user = await userModel.findOne({ email }).lean();
    
    return user;
}

    async updateUserPassword(id, newPassword) {
        const updatedUser = await this.dao.update(id, { password: newPassword });
        return updatedUser;
}
}
