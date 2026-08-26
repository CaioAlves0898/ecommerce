import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { asyncHandler } from '../../middleware/errorHandler';
import * as categoriesService from './categories.service';

export const getCategories = asyncHandler(async (req: AuthRequest, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const search = req.query.search as string;

  const result = await categoriesService.getCategories(page, limit, search);
  
  res.json({
    success: true,
    data: result.data,
    meta: result.meta,
  });
});

export const getCategoryById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const category = await categoriesService.getCategoryById(req.params.id);
  
  res.json({
    success: true,
    data: category,
  });
});

export const getCategoryBySlug = asyncHandler(async (req: AuthRequest, res: Response) => {
  const category = await categoriesService.getCategoryBySlug(req.params.slug);
  
  res.json({
    success: true,
    data: category,
  });
});

export const createCategory = asyncHandler(async (req: AuthRequest, res: Response) => {
  const category = await categoriesService.createCategory(req.body);
  
  res.status(201).json({
    success: true,
    message: 'Category created successfully',
    data: category,
  });
});

export const updateCategory = asyncHandler(async (req: AuthRequest, res: Response) => {
  const category = await categoriesService.updateCategory(req.params.id, req.body);
  
  res.json({
    success: true,
    message: 'Category updated successfully',
    data: category,
  });
});

export const deleteCategory = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await categoriesService.deleteCategory(req.params.id);
  
  res.json({
    success: true,
    message: result.message,
  });
});