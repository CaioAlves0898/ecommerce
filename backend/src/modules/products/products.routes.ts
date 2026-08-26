import { Router } from 'express';
import { validate } from '../../middleware/validate';
import { authenticate, authorize, optionalAuth } from '../../middleware/auth';
import * as productsController from './products.controller';
import { createProductSchema, updateProductSchema, productParamsSchema, productQuerySchema } from './products.validation';

const router = Router();

router.get('/', validate(productQuerySchema), optionalAuth, productsController.getProducts);
router.get('/category/:slug', validate(productQuerySchema), optionalAuth, productsController.getProductsByCategory);
router.get('/:id', validate(productParamsSchema), optionalAuth, productsController.getProductById);

router.use(authenticate, authorize('ADMIN'));
router.post('/', validate(createProductSchema), productsController.createProduct);
router.patch('/:id', validate(updateProductSchema), productsController.updateProduct);
router.delete('/:id', validate(productParamsSchema), productsController.deleteProduct);

export default router;