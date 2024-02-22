import { Router, json } from 'express';
import { productController } from '../controllers/products.controller.js';
import upload from '../middlewares/multer.middleware.js';
import { productService } from '../services/products.service.js';
import customError from '../errors/errors.generator.js';
import { errorMessage, errorName } from '../errors/errors.enum.js';
import { handleErrors } from '../errors/handle.Errors.js';

const productsRouter = Router();

productsRouter.get('/', productController.getAllProducts);
productsRouter.get('/:pid', productController.getProductById);
productsRouter.post('/', productController.createProduct); 
/* productsRouter.post('/multer',productController.createProductMulter);
 */
productsRouter.post('/multer', upload.single('thumbnails'), async (req, res) => { productController.createProductMulter(req,res) })
/* productsRouter.post('/multer', upload.single('thumbnails'), async (req, res) => {
    try {
      const thumbnails = req.file;
  
      const productData = {
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        code: req.body.code,
        stock: req.body.stock,
        status: true,
        thumbnails: thumbnails,
        owner: req.body.userRole || 'Premium',
        ownerEmail: req.body.userEmail || null,
      };
  
      try {
        const createdProduct = await productService.createProduct(productData);
        res.status(200).json({ message: 'Producto agregado correctamente', product: createdProduct });
      } catch (error) {
        console.error('Error in createProduct controller:', error);
        handleErrors(res, customError.generateError(errorMessage.CREATE_PRODUCT_ERROR, 400, errorName.CREATE_PRODUCT_ERROR));
      }
    } catch (error) {
      console.error('Error in createProduct controller:', error);
      handleErrors(res, customError.generateError(errorMessage.CREATE_PRODUCT_ERROR, 400, errorName.CREATE_PRODUCT_ERROR));
    }
  }); */
productsRouter.put('/:pid', productController.updateProductById);
productsRouter.delete('/:pid', productController.deleteProductById);

export default productsRouter;
