 
import { usersRepository } from "../repositories/users.repository.js";
import customError from '../errors/errors.generator.js'
import { errorMessage, errorName } from "../errors/errors.enum.js";
class UsersService {
  async findByEmail(email) {
    try {
      return await usersRepository.findByEmail(email);
    } catch (error) {
      throw customError.generateError(errorMessage.EMAIL_NOT_FOUND, error.code, errorName.EMAIL_NOT_FOUND);
    }
  }
  async findById(id){
    try {
      return await usersRepository.findById(id);
    } catch (error) {
      throw customError.generateError(errorMessage.USER_NOT_FOUND, error.code, errorName.USER_NOT_FOUND);
    }
  }
  async findByResetToken(token) {
    try {
return await usersRepository.findByResetToken(token);
    } catch (error) {
throw customError.generateError(errorMessage.RESET_TOKEN_NOT_FOUND, error.code, errorName.RESET_TOKEN_NOT_FOUND);
    }
  }
  
  
}


export const usersService = new UsersService();
