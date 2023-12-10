
import { usersManager } from '../dao/db/manager/users.manager.js';

class UsersService {
  async findByEmail(email) {
    try {
      return await usersManager.findByEmail(email);
    } catch (error) {
      console.error("Error en al encontrar email", error);
      throw error;
    }
  }

}


export const usersService = new UsersService();
