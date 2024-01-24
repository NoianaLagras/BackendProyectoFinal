import { Router } from "express";
import __dirname from '../config/utils.js';
import { logger } from "../config/logger.js";
//auth
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { jwtValidator } from "../middlewares/jwt.middleware.js";
import flash from "express-flash";
import { cartsService } from "../services/cart.service.js";
import { messageRepository } from "../repositories/message.repository.js";
import { cartsRepository } from "../repositories/cart.repository.js";
import { productRepository } from "../repositories/products.repository.js";
import { transport } from "../config/nodemailer.js";
import { generateProduct} from "../faker.js";
import config from "../config/config.js";
import { UsersManager } from "../dao/factory.js";
import { usersRepository } from "../repositories/users.repository.js";
import { usersController } from "../controllers/users.controller.js";
import { usersService } from "../services/users.service.js";
const adminAuthMiddleware = ['Admin']
const adminPremiumMiddleware=['Admin', 'Premium']
const userAuthMiddleware = ['Admin', 'User','Premium']

const viewsRouter = Router();

viewsRouter.get('/', async (req, res) => {
  try {
    const limit = 12;

    const { result } = await productRepository.findAllCustom({
      limit: limit,
    });

    const productObject = result.map(doc => doc.toObject());
    
   

    res.render('home', {
      productList: productObject,

    });

  } catch (error) {
    logger.error(`Error: ${error}`)
    res.status(500).json({ error: 'Error al cargar la vista.' });
  }
});


viewsRouter.get('/realtimeproducts', jwtValidator, authMiddleware(adminPremiumMiddleware), async (req, res) => {
  try {
    const limit = 100;
    const userRole = req.user.role;
    const user = req.user;
    const { result } = await productRepository.findAllCustom({
      limit: limit,
    });

    

    const productObject = result.map(doc => {
      const productData = doc.toObject();

      if (userRole === 'Admin' || userRole === 'Premium') {
        productData.owner = userRole;
      } else {
        productData.owner = 'Admin';
      }

      productData.ownerEmail = user.email;

      return productData;
    });

    res.render('realTimeProducts', {
      productList: productObject,
      userEmail: user.email,
      userRole: userRole,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al cargar la vista.' });
  }
});






viewsRouter.get('/api/users/premium/:uid', jwtValidator, authMiddleware(userAuthMiddleware), async (req, res) => {
  try {
    const userId = req.params.uid;
    const user = await usersRepository.findById(userId);
    const currentRole = user ? user.role : null;

    res.render('roleChange', { userId, currentRole });
  } catch (error) {
    console.error(error);

    const message = { error: 'Error interno del servidor' };
    res.status(500).json(message);
  }
});



viewsRouter.get('/chat',jwtValidator,authMiddleware(userAuthMiddleware), async (req, res) => {
  try {
    const {email:userEmail}= req.user
    const messages = await messageRepository.getAllMessages();
    res.render('chat', { messages , userEmail });
  } catch (error) {
    console,log(error)
    res.redirect('/login')}
});

viewsRouter.get('/api/products',jwtValidator,authMiddleware(userAuthMiddleware), async (req, res) => {
  try {
    const { info, result } = await productRepository.findAllCustom(req.query);

  const productObject = result.map(doc => doc.toObject());
  const { cartId } = req.user;
  const { cartLenght } = await cartsRepository.findCartById(cartId);
  if (req.session.errorMessage) {
    return res.redirect('/error');
}
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


viewsRouter.get('/api/product/:pid', jwtValidator,authMiddleware(userAuthMiddleware), async (req, res) => {
  try {
      const pid = req.params.pid;
      const { cartId } = req.user;

      const product = await productRepository.findById(pid);

      if (!product) {
          return res.status(404).json({ error: 'Producto no encontrado.' });
      }

      res.render('productView', { product, cartId });
  } catch (error) {
    res.redirect('/login')
      }
});


viewsRouter.get('/api/cart/:cid', async (req, res) => {
  try {
    const idCart = req.params.cid;
    const {cart , total} = await cartsRepository.findCartById(idCart); 
    res.render('cart', { cart ,total ,idCart});
   } catch (error) {

    res.status(500).send('Error al renderizar la página de carrito');
  }
});

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

//purchase
viewsRouter.get("/:idCart/purchase", jwtValidator, async (req, res) => {
  try {
    const { idCart } = req.params;
    const { email: userEmail } = req.user;

    const response = await cartsService.purchase(idCart, userEmail, req.user);

    if (response.success) {
      res.render('purchased', {
        message: response.message,
        availableProducts: response.availableProducts,
        total: response.total,
        unavailableProducts: response.unavailableProducts,
      });
    } else {
      res.render('purchaseFailed', {
        message: response.message,
        unavailableProducts: response.unavailableProducts,
      });
    }

    logger.info('purchased', response);

    const mailOptions = {
      from: 'Noi Lagras',
      to: userEmail,
      subject: 'Prueba de email - coderBackend',
      text: `Productos comprados: ${response.availableProducts}\nProductos sin stock: ${response.unavailableProducts}`
    };

    await transport.sendMail(mailOptions);
    logger.info('Correo electrónico enviado');

  } catch (error) {
    logger.error(`Error: ${error}`);
    res.redirect('/login');
  }
});



//restaurar

viewsRouter.get('/restore', async (req, res) => {
  res.render('restore');
});



viewsRouter.get('/restorePassword/:token', async (req, res) => {
  const { token } = req.params;
  try {
const user = await usersService.findByResetToken(token.toString());
    if (!user || !user.resetToken || user.resetToken.expiration < new Date()) {
      res.redirect('/restore');
    } else {
      res.render('restorePassword', { token });
    }
  } catch (error) {
    logger.error('Error  al restaurar password', error);
    res.redirect('/restore');
  }
});





viewsRouter.get('/error', async (req, res) => {
  const errorMessage = req.session.errorMessage;
  req.session.errorMessage = null;

  res.render('error', { errorMessage });
});


 /* json mocking
 viewsRouter.get('/mockingproducts', async (req, res) => {
  const products = [];
  for (let i = 0; i < 100; i++) {
    products.push(generateProduct());
  }
  res.json(products)})*/

 // Renderizado  de productos mocking:
 viewsRouter.get('/mockingproducts', async (req, res) => {
  const products = [];
  for (let i = 0; i < 100; i++) {
    products.push(generateProduct());
  }
  res.render('home', {
    productList: products,
    
  });}) 

 
export default viewsRouter;