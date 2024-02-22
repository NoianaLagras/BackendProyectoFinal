 
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
  
  async updateUserAvatar(id, updatedUserData) {
    try {
      const updatedUser = await usersRepository.updateOne(id, updatedUserData);
      if (!updatedUser) {
        throw customError.generateError(errorMessage.USER_NOT_FOUND, 404, errorName.USER_NOT_FOUND);
      }
      return updatedUser;
    } catch (error) {
      throw customError.generateError(errorMessage.UPDATE_USER_ERROR, error.code, errorName.UPDATE_USER_ERROR);
    }
  }
 
  async saveUserDocs(id, { dni, address, bank }) {
    try {
        const documents = [];

        if (dni && dni.length > 0) {
            documents.push({ name: "dni", reference: dni[0].filename });
        }

        if (address && address.length > 0) {
            documents.push({ name: "address", reference: address[0].filename });
        }

        if (bank && bank.length > 0) {
            documents.push({ name: "bank", reference: bank[0].filename });
        }

        const savedDocuments = await usersRepository.updateOne(id, { documents });

        return savedDocuments;
    } catch (error) {
        throw customError.generateError(errorMessage.DOCUMENTS_NOT_UPDATED, error.code, errorName.UPDATE_USER_ERROR);
    }
}



}


export const usersService = new UsersService();
