import { UserModel } from "../models/Users.model.js";

class UsersManager {
    async findById(id){
        const response = await  UserModel.findById(id);
        return response;
    }
    async findByEmail(email){
        const response = await  UserModel.findOne({email});
        return response;
    }
    async createOne(obj){
        const response = await  UserModel.create(obj);
        return response;
    }
}
export const usersManager = new UsersManager();