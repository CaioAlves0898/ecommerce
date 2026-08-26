import { Router } from 'express';
import { validate } from '../../middleware/validate';
import { authenticate, authorize } from '../../middleware/auth';
import * as ordersController from './orders.controller';
import { createOrderSchema, updateOrderStatusSchema, orderParamsSchema, orderQuerySchema } from './orders.validation';

const router = Router();

router.use(authenticate);

router.get('/', validate(orderQuerySchema), ordersController.getOrders);
router.get('/:id', validate(orderParamsSchema), ordersController.getOrderById);
router.post('/', validate(createOrderSchema), ordersController.createOrder);
router.patch('/:id/cancel', validate(orderParamsSchema), ordersController.cancelOrder);

router.use(authorize('ADMIN'));
router.patch('/:id/status', validate(updateOrderStatusSchema), ordersController.updateOrderStatus);

export default router;