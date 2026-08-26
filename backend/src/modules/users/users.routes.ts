import { Router } from 'express';
import { validate } from '../../middleware/validate';
import { authenticate, authorize } from '../../middleware/auth';
import * as usersController from './users.controller';
import { updateUserSchema, changePasswordSchema } from './users.validation';

const router = Router();

router.use(authenticate, authorize('ADMIN'));

router.get('/', usersController.getUsers);
router.get('/:id', usersController.getUserById);
router.patch('/:id', validate(updateUserSchema), usersController.updateUser);
router.patch('/:id/password', validate(changePasswordSchema), usersController.changePassword);
router.delete('/:id', usersController.deleteUser);

export default router;