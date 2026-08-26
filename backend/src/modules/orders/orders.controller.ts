import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { asyncHandler } from '../../middleware/errorHandler';
import * as ordersService from './orders.service';

export const getOrders = asyncHandler(async (req: AuthRequest, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const status = req.query.status as string;

  const result = await ordersService.getOrders(req.user!.id, req.user!.role, page, limit, status);
  
  res.json({
    success: true,
    data: result.data,
    meta: result.meta,
  });
});

export const getOrderById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const order = await ordersService.getOrderById(req.params.id, req.user!.id, req.user!.role);
  
  res.json({
    success: true,
    data: order,
  });
});

export const createOrder = asyncHandler(async (req: AuthRequest, res: Response) => {
  const order = await ordersService.createOrder(req.user!.id, req.body);
  
  res.status(201).json({
    success: true,
    message: 'Order created successfully',
    data: order,
  });
});

export const updateOrderStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
  const order = await ordersService.updateOrderStatus(req.params.id, req.body);
  
  res.json({
    success: true,
    message: 'Order status updated successfully',
    data: order,
  });
});

export const cancelOrder = asyncHandler(async (req: AuthRequest, res: Response) => {
  const order = await ordersService.cancelOrder(req.params.id, req.user!.id, req.user!.role);
  
  res.json({
    success: true,
    message: 'Order cancelled successfully',
    data: order,
  });
});