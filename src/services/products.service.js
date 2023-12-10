import { productManager } from "../dao/db/manager/products.manager.js";

class ProductService {
  async getAllProducts(query) {
    try {
      return await productManager.findAllCustom(query);
    } catch (error) {
      throw error;
    }
  }

  async getProductById(id) {
    try {
      return await productManager.findById(id);
    } catch (error) {
      throw error;
    }
  }

  async createProduct(data) {
    try {
      return await productManager.createOne(data);
    } catch (error) {
      throw error;
    }
  }

  async updateProductById(id, data) {
    try {
      const result = await productManager.updatedOne(id, data);

      if (result.matchedCount > 0) {
        return true; 
      } else {
        throw new Error('Producto no encontrado para actualizar');
      }
    } catch (error) {
      throw error;
    }
  }

  async deleteProductById(id) {
    try {
      await productManager.deleteOne(id);
      return true; 
    } catch (error) {
      throw error;
    }
  }
}

export const productService = new ProductService();
