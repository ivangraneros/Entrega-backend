import userModel from "../models/user.model.js";

export default class UserDao {
    async getOne(params) {
        return await userModel.findOne(params);
    }

    async getAll() {
        return await userModel.find();
    }

    async create(user) {
        return await userModel.create(user);
    }

    async update(id, user) {
        return await userModel.findByIdAndUpdate(id, user, { new: true });
    }
}
