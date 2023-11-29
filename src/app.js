import express  from "express";
import __dirname from './utils.js';
import exphbs from 'express-handlebars';
import { allowInsecurePrototypeAccess } from '@handlebars/allow-prototype-access';
import Handlebars from 'handlebars';
import flash from "express-flash";
import { Server } from "socket.io";
import productsRouter from "./Routes/products.routes.js";
import cartsRouter from "./Routes/cart.routes.js";
import viewsRouter from "./Routes/views.routes.js";
import messageRouter from "./Routes/message.routes.js";
import sessionRouter from "./Routes/session.routes.js";
import cookieParser from "cookie-parser";
import session from 'express-session';
import MongoStore from "connect-mongo";
import './passport.js';
import passport from "passport";
// coneccion a db
import "./dao/db/configDB.js"
import { messageManager } from "./dao/db/manager/message.manager.js";
import { productManager } from "./dao/db/manager/products.manager.js";


const app = express();
const PORT = 8080 ;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname+'/public'));
app.use(cookieParser('SecretCookie'));
//flash
app.use(flash());


//mongo 
const URI ="mongodb+srv://noiLagras:sUajV3for8LoqE2c@cluster0.atnqnrl.mongodb.net/ecommerce?retryWrites=true&w=majority"
app.use(
  session({
    store: new MongoStore({
      mongoUrl: URI,
    }),
    secret: "secretSession",
    cookie: { maxAge: 60000 },
  })
);

//passport 
app.use(passport.initialize());
//Sacar si uso JWT
//app.use(passport.session())

//handlebars
const hbs = exphbs.create({
  extname: 'handlebars',
  defaultLayout: 'main',
  handlebars: allowInsecurePrototypeAccess(Handlebars),
  //creacion de helper para igualar 
  helpers: {
    ifEqual: function(arg1, arg2, options) {
      return arg1 === arg2 ? options.fn(this) : options.inverse(this);
    },
  }
});

app.engine('handlebars', hbs.engine);
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

//routes de products , carts , mensaje

app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);
app.use('/api/sessions', sessionRouter)
app.use('/chat', messageRouter);
app.use('/products', productsRouter);

// Iniciar el servidor
const httpServer = app.listen(PORT, () => {
    console.log(`Escuchando en el puerto ${PORT}`);
});

app.on('error', (error) => {
    console.log(`Error: ${error}`);
});

const socketServer = new Server(httpServer);
socketServer.on('connection', async (socket) => {
  console.log(`Cliente Conectado: ${socket.id}`);

  socket.on("disconnect", () => {
      console.log(`Cliente Desconectado: ${socket.id}`);
  });
// agregar product en mongo
socket.on('addProduct', async (product) => {
  try {
    const createdProduct = await productManager.createOne(product);
    const productosActualizados = await productManager.findAllCustom({limit:100}); 
    const productObject= productosActualizados.result.map(doc => doc.toObject())
    socketServer.emit('actualizarProductos', productObject);
    
  } catch (error) {
    console.error('Error al agregar el producto:', error.message);
  }
});

  socket.on('deleteProduct', async (id) => {
    try {

      const result = await productManager.deleteOne({ _id: id });
  
      if (result.deletedCount > 0) {
        const productosActualizados = await productManager.findAllCustom({limit:100});
        const productObject= productosActualizados.result.map(doc => doc.toObject())
        socketServer.emit('actualizarProductos', productObject);
      } else {
        console.error('El producto no se encontró para eliminar.');
      }
    } catch (error) {
      console.error('Error al eliminar el producto:', error.message);
    }
  });
// mensajes

  socket.on('addMessage', async (data) => {
    try {
      const { email, message } = data;
       const savedMessage = await messageManager.createOne(email, message);
     const messages = await messageManager.findAll();
       socketServer.emit('actualizarMensajes', messages);
    } catch (error) {
      console.error('Error al agregar el mensaje:', error.message);
    }
  });
});
