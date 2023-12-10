import { productManager } from "./products.manager.js";
import { messageManager } from "./message.manager.js";

class SocketManager {
  constructor(socketServer) {
    this.socketServer = socketServer;
  }

  handleConnection(socket) {
    console.log(`Cliente Conectado: ${socket.id}`);

    socket.on("disconnect", () => {
      console.log(`Cliente Desconectado: ${socket.id}`);
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
      const createdProduct = await productManager.createOne(product);
      const productosActualizados = await productManager.findAllCustom({ limit: 100 });
      const productObject = productosActualizados.result.map(doc => doc.toObject());
      this.socketServer.emit('actualizarProductos', productObject);
    } catch (error) {
      console.error('Error al agregar el producto:', error.message);
    }
  }

  async handleDeleteProduct(id) {
    try {
      const result = await productManager.deleteOne({ _id: id });

      if (result.deletedCount > 0) {
        const productosActualizados = await productManager.findAllCustom({ limit: 100 });
        const productObject = productosActualizados.result.map(doc => doc.toObject());
        this.socketServer.emit('actualizarProductos', productObject);
      } else {
        console.error('El producto no se encontró para eliminar.');
      }
    } catch (error) {
      console.error('Error al eliminar el producto:', error.message);
    }
  }

  async handleAddMessage(data) {
    try {
      const { email, message } = data;
      const savedMessage = await messageManager.createOne(email, message);
      const messages = await messageManager.findAll();
      this.socketServer.emit('actualizarMensajes', messages);
    } catch (error) {
      console.error('Error al agregar el mensaje:', error.message);
    }
  }
}

export const socketManager = (socketServer) => {
  const managerInstance = new SocketManager(socketServer);
  return {
    handleConnection: (socket) => managerInstance.handleConnection(socket),
  };
};
