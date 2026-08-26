import { Router } from 'express';
import { validate } from '../../middleware/validate';
import { authenticate, authorize } from '../../middleware/auth';
import * as categoriesController from './categories.controller';
import { createCategorySchema, updateCategorySchema, categoryParamsSchema } from './categories.validation';

const router = Router();

router.get('/', categoriesController.getCategories);
router.get('/slug/:slug', categoriesController.getCategoryBySlug);
router.get('/:id', validate(categoryParamsSchema), categoriesController.getCategoryById);

router.use(authenticate, authorize('ADMIN'));
router.post('/', validate(createCategorySchema), categoriesController.createCategory);
router.patch('/:id', validate(updateCategorySchema), categoriesController.updateCategory);
router.delete('/:id', validate(categoryParamsSchema), categoriesController.deleteCategory);

export default router;