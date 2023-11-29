import BasicManager from './basic.manager.js';
import { UserModel } from '../models/Users.model.js';

 class UsersManager extends BasicManager {
    constructor() {
        super(UserModel, ''); 
    }
    //findById y createOne heredados
    async findByEmail(email){
        try{
        const response = await  UserModel.findOne({email});
        return response;
    } catch (error) {
            console.error("Error en findByEmail:", error);
            throw error;
        }
    }

}
export const usersManager = new UsersManager()