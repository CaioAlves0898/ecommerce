import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { asyncHandler } from '../../middleware/errorHandler';
import * as usersService from './users.service';

export const getUsers = asyncHandler(async (req: AuthRequest, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const search = req.query.search as string;

  const result = await usersService.getUsers(page, limit, search);
  
  res.json({
    success: true,
    data: result.data,
    meta: result.meta,
  });
});

export const getUserById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await usersService.getUserById(req.params.id);
  
  res.json({
    success: true,
    data: user,
  });
});

export const updateUser = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await usersService.updateUser(req.params.id, req.body);
  
  res.json({
    success: true,
    message: 'User updated successfully',
    data: user,
  });
});

export const changePassword = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await usersService.changePassword(req.params.id, req.body);
  
  res.json({
    success: true,
    message: result.message,
  });
});

export const deleteUser = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await usersService.deleteUser(req.params.id);
  
  res.json({
    success: true,
    message: result.message,
  });
});