import BasicManager from "./basic.manager.js";
import { MessageModel } from "../models/Message.model.js";

class MessageManager extends BasicManager {
  constructor() {
    super(MessageModel, '');
  }
  async createOne(email, message) {
    try {
      const savedMessage = await MessageModel.create({ email, message });
      return savedMessage;
    } catch (error) {
      throw error;
    }
  }

 //findAll y findById y delete heredados de basic 


}

export const messageManager = new MessageManager();
