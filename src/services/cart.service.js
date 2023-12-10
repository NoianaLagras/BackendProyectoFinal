import { cartsManager } from "../dao/db/manager/carts.manager.js";

class CartsService {
  async getAllCarts() {
    try {
      const carts = await cartsManager.findAll();
      return { message: "Carritos :", carts };
    } catch (error) {
      throw new Error("Error al obtener los Carts");
    }
  }

  async getCartById(idCart) {
    try {
      const cart = await cartsManager.findCartById(idCart);
      if (!cart) {
        return { message: "Carrito no encontrado" };
      }
      return { cart };
    } catch (error) {
      throw new Error("Error al buscar carrito");
    }
  }

  async createCart() {
    try {
      const createdCart = await cartsManager.createCart();
      return { message: "Carrito creado correctamente", Cart: createdCart };
    } catch (error) {
      throw new Error("Error al crear carrito");
    }
  }

  async addProductToCart(idCart, idProduct, quantity) {
    try {
      const cart = await cartsManager.addProductToCart(idCart, idProduct, quantity);
      return { cart };
    } catch (error) {
      console.error("Error al agregar producto al carrito:", error);
      throw error; 
    }
  }
  

  async removeAllProducts(idCart) {
    try {
      const updatedCart = await cartsManager.deleteAllProducts(idCart);
      return { message: "Se ha vaciado el carrito", updatedCart };
    } catch (error) {
      throw new Error("Error vaciando carrito");
    }
  }

  async removeProductFromCart(idCart, idProduct) {
    try {
      const updatedCart = await cartsManager.removeProductFromCart(idCart, idProduct);
      if (!updatedCart) {
        return { message: "Producto no encontrado" };
      }
      return updatedCart;
    } catch (error) {
      throw new Error("Error eliminando producto del carrito");
    }
  }

  async updateCart(idCart, updatedProducts) {
    try {
      const updatedCart = await cartsManager.updateCart(idCart, updatedProducts);
      if (!updatedCart) {
        return { message: "Carrito no encontrado" };
      }
      return updatedCart;
    } catch (error) {
      throw new Error("Error actualizando carrito");
    }
  }

  async updateProductQuantity(idCart, idProduct, quantity) {
    try {
      const updatedCart = await cartsManager.updateProductQuantity(idCart, idProduct, quantity);
      if (!updatedCart) {
        return { message: "Carrito o Producto no encontrado" };
      }
      return updatedCart;
    } catch (error) {
      throw new Error("Error al actualizar carrito");
    }
  }
}


export const cartsService = new CartsService();