import { ticketDao } from "../dao/Mongo/manager/Tickets.dao.js";
import { cartsManager } from "../dao/Mongo/manager/carts.dao.js";
import { v4 as uuidv4 } from 'uuid';

import { usersManager } from "../dao/Mongo/manager/users.dao.js";

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

  async purchase(idCart, userEmail, userToken) {
    try {
        const { Email, cartId } = userToken;

        if (cartId !== idCart) {
            throw new Error("El ID del carrito en el token no coincide con el ID proporcionado");
        }

        const user = await usersManager.findByEmail(userEmail);
        const { cart, total, cartLength } = await cartsManager.findCartById(idCart);

        if (cart === null) {
            throw new Error("El carrito no se ha recuperado correctamente");
        }

        const products = cart.products;
        console.log("Products:", products);

        let availableProducts = [];
        let unavailableProducts = [];

        for (let item of products) {
            if (item.product.stock >= item.quantity) {
                availableProducts.push(item);
                item.product.stock -= item.quantity;
                await item.product.save();
            } else {
                unavailableProducts.push(item);
            }
        }

        cart.products = unavailableProducts;
        await cart.save();

        if (availableProducts.length) {
            const ticket = {
                code: uuidv4(),
                amount: total,
                purchase_datetime: new Date(),
                purchaser: user._id,
            };

            await ticketDao.createOne(ticket);

            user.orders.push(ticket._id);
            await user.save();

            return { availableProducts, total };
        }

        return { unavailableProducts };
    } catch (error) {
        console.error('Error en la función de ticket', error);
        throw error;
    }
}

}

export const cartsService = new CartsService();
