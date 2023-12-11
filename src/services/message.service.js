import { messageManager } from "../dao/db/manager/message.manager.js";

class MessageService {
    async getAllMessages() {
      try {
        return await messageManager.findAll();
      } catch (error) {
        throw error;
      }
    }
  
    async getMessageById(id) {
      try {
        return await messageManager.findById(id);
      } catch (error) {
        throw error;
      }
    }
  
    async createMessage(email, message) {
      try {
        return await messageManager.createOne(email, message);
      } catch (error) {
        throw error;
      }
    }
  
    async deleteMessageById(id) {
      try {
        const result = await messageManager.deleteOne(id);
        if (result.deletedCount > 0) {
          return true; 
        } else {
          throw new Error('Mensaje no encontrado para eliminar');
        }
      } catch (error) {
        throw error;
      }
    }
  }
export const messageService = new MessageService();  