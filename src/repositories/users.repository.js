import { UsersManager } from "../dao/factory.js";
import { logger } from "../config/logger.js";
class UsersRepository {
  constructor() {
    this.dao = new UsersManager();
  }
  async createOne(user){
    try {
      return await this.dao.createOne(user)
    } catch (error) {
      logger.error(`Error al crear user: ${error}`);
      
    }
  }
  async findByEmail(email) {
    try {
      return await this.dao.findByEmail(email);
    } catch (error) {
      logger.error(`Error al encontrar email ${error}`);
    }
  }
  async findByEmailAndPopulateOrders(email) {
    try {
      return await this.dao.findByEmailAndPopulateOrders(email);
    } catch (error) {
      logger.error(`Error al encontrar email ${error}`);
      
    }
  }
  async findById(id){
    try {
      return await this.dao.findById(id)
    } catch (error) {
      logger.error(`Error encontrar id ${error}`);
      
    }
  }
  async findByResetToken(token) {
    try {
  return await this.dao.findByResetToken(token);
    } catch (error) {
logger.error(`Error encontrar al token ${error}`);
    }
  }
}

export const usersRepository = new UsersRepository();
