import { Router } from "express";
import { productManager }  from "../dao/db/manager/products.manager.js";
import { messageManager } from "../dao/db/manager/message.manager.js";
import __dirname from '../utils.js';
import { cartsManager } from "../dao/db/manager/carts.manager.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { jwtValidator } from "../middlewares/jwt.middleware.js";


const viewsRouter = Router();
viewsRouter.get('/', async (req, res) => {
  try {
    const limit = 12;

    const { result } = await productManager.findAllCustom({
      limit: limit,
    });

    const productObject = result.map(doc => doc.toObject());

   

    res.render('home', {
      productList: productObject
    });

  } catch (error) {
    res.status(500).json({ error: 'Error al cargar la vista.' });
  }
});

viewsRouter.get('/realtimeproducts',jwtValidator, authMiddleware(), async (req, res) => {
  try {
    const limit = 100; 

    const { result } = await productManager.findAllCustom({
      limit: limit, 
    });
    const productObject = result.map(doc => doc.toObject());
    res.render('realTimeProducts', {
      productList: productObject,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al cargar la vista.' });
  }
});


viewsRouter.get('/chat', async (req, res) => {
  try {
    const messages = await messageManager.findAll();
    res.render('chat', { messages });
  } catch (error) {
    res.status(500).json({ error: 'Error al cargar la vista de chat.' });
  }
});

viewsRouter.get('/api/products',jwtValidator, async (req, res) => {
  try {
    const { info, result } = await productManager.findAllCustom(req.query);

  const productObject = result.map(doc => doc.toObject());
  const { cartId } = req.user;
  const { cartLenght } = await cartsManager.findCartById(cartId);
 res.render('products', {
      productList: productObject,
      user: req.user,
      cartLenght,
      pagination: {
        prevLink: info.prevLink,
        nextLink: info.nextLink,
    },
    });
  } catch (error) {
    res.redirect('/login')
  }
});


viewsRouter.get('/api/product/:pid', jwtValidator, async (req, res) => {
  try {
      const pid = req.params.pid;
      const { cartId } = req.user;

      const product = await productManager.findById(pid);

      if (!product) {
          return res.status(404).json({ error: 'Producto no encontrado.' });
      }

      res.render('productView', { product, cartId });
  } catch (error) {
    res.redirect('/error')
      }
});


viewsRouter.get('/api/cart/:cid', async (req, res) => {
  try {
    const idCart = req.params.cid;
    const {cart , total} = await cartsManager.findCartById(idCart); 
    res.render('cart', { cart ,total });
   } catch (error) {

    res.status(500).send('Error al renderizar la página de carrito');
  }
});


//Session en passport ?

// viewsRouter
viewsRouter.get('/signup', async (req, res) => {
if (req.authenticated) {
      return res.redirect('/api/products');
  }
  res.render('signup', { user: req.user });
});

viewsRouter.get('/login', async (req, res) => {
  if (req.authenticated) {
      return res.redirect('/api/products');
  }

 res.render('login', { user: req.user });
});






viewsRouter.get('/restore', async (req, res) => {
  
 res.render('restore')
});
viewsRouter.get('/error', async (req, res) => {
  
  res.render('error')
 });
export default viewsRouter;