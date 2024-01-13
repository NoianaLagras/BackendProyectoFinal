//import { productRepository } from "./Mongo/manager/products.dao.js";
//import { messageManagers } from "./Mongo/manager/message.dao.js";
import { productRepository } from "../repositories/products.repository.js";
import { messageRepository } from "../repositories/message.repository.js";
import { logger } from "../config/logger.js";

class SocketManager {
  constructor(socketServer) {
    this.socketServer = socketServer;
  }

  handleConnection(socket) {
    logger.info(`Cliente Conectado: ${socket.id}`);

    socket.on("disconnect", () => {
      logger.info(`Cliente Desconectado: ${socket.id}`);
    });

    // RealTimeProducts
    socket.on('addProduct', async (product) => {
      await this.handleAddProduct(product);
    });
    socket.on('deleteProduct', async (id) => {
      await this.handleDeleteProduct(id);
    });

//Mensajes
    socket.on('addMessage', async (data) => {
      await this.handleAddMessage(data);
    });
  }

  async handleAddProduct(product) {
    try {
      const createdProduct = await productRepository.createOne(product);
      const productosActualizados = await productRepository.findAllCustom({ limit: 100 });
      const productObject = productosActualizados.result.map(doc => doc.toObject());
      this.socketServer.emit('actualizarProductos', productObject);
    } catch (error) {
      logger.error(`Error al agregar el producto: ${error.message}`);
    }
  }

  async handleDeleteProduct(id) {
    try {
      const result = await productRepository.deleteOne(id);
  
      if (result) {
        const productosActualizados = await productRepository.findAllCustom({ limit: 100 });
        const productObject = productosActualizados.result.map(doc => doc.toObject());
        this.socketServer.emit('actualizarProductos', productObject);
      } else {
        logger.warning('El producto no se encontró para eliminar.');
      }
    } catch (error) {
      logger.error(`Error al eliminar: ${error.message}`);
    }
  }
  

  async handleAddMessage(data) {
    try {
      const { email, message } = data;
      const savedMessage = await messageRepository.createMessage(email, message);
      const messages = await messageRepository.getAllMessages();
      this.socketServer.emit('actualizarMensajes', messages);
    } catch (error) {
      logger.error(`Error al enviar mensaje ${error.message}`);
    }
  }
}

export const socketManager = (socketServer) => {
  const managerInstance = new SocketManager(socketServer);
  return {
    handleConnection: (socket) => managerInstance.handleConnection(socket),
  };
};
