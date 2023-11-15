import { Router } from "express";
import { productManager } from "../dao/db/manager/products.manager.js";
import { messageManager } from "../dao/db/manager/message.manager.js";
import __dirname from '../utils.js';
import { cartsManager } from "../dao/db/manager/carts.manager.js";


const viewsRouter = Router();
viewsRouter.get('/', async (req, res) => {
  try {
    const limit = 12;

    const { result } = await productManager.findAll({
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

viewsRouter.get('/realtimeproducts', async (req, res) => {
  try {
    const limit = 100; 

    const { result } = await productManager.findAll({
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

viewsRouter.get('/api/products', async (req, res) => {
  try {
    const { info, result } = await productManager.findAll(req.query);

  const productObject = result.map(doc => doc.toObject());

  if (!req.session.passport) {
    return res.redirect('/login');
  }
 res.render('products', {
      productList: productObject,
      user: req.user,
      pagination: {
        prevLink: info.prevLink,
        nextLink: info.nextLink,
    },
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al cargar la vista.' });
  }
});


viewsRouter.get('/api/product/:pid', async (req, res) => {
  try {
    const pid = req.params.pid;
    const product = await productManager.findById(pid);
    if (!req.session.passport) {
      return res.redirect('/login');
    }
    res.render('productView', { product , addProductToCart: cartsManager.addProductToCart });
  } catch (error) {
    res.status(500).json({ error: 'Error al cargar los detalles del producto.' });
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




viewsRouter.get('/login', async (req, res) => {
  if (req.session.passport){
    return res.redirect('/api/products')
  }
 res.render('login',{user:req.user})
});


viewsRouter.get('/signup', async (req, res) => {
  if (req.session.passport){
    return res.redirect('/api/products')
  }
 res.render('signup')
});




viewsRouter.get('/restore', async (req, res) => {
  
 res.render('restore')
});
viewsRouter.get('/error', async (req, res) => {
  
  res.render('error')
 });
export default viewsRouter;