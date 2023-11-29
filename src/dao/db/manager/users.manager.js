import BasicManager from './basic.manager.js';
import { UserModel } from '../models/Users.model.js';

 class UsersManager extends BasicManager {
    constructor() {
        super(UserModel, ''); 
    }
    //findById y createOne heredados
    async findByEmail(email) {
        try {
            const response = await this.model.findOne({ email }).lean().populate(this.populateProps);
            return response;
        } catch (error) {
            throw error;
        }
    }

}
export const usersManager = new UsersManager()