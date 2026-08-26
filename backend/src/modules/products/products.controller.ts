import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { asyncHandler } from '../../middleware/errorHandler';
import * as productsService from './products.service';

export const getProducts = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await productsService.getProducts(req.query as any);
  
  res.json({
    success: true,
    data: result.data,
    meta: result.meta,
  });
});

export const getProductById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const product = await productsService.getProductById(req.params.id);
  
  res.json({
    success: true,
    data: product,
  });
});

export const getProductsByCategory = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await productsService.getProductsByCategorySlug(req.params.slug, req.query as any);
  
  res.json({
    success: true,
    data: result.data,
    meta: result.meta,
  });
});

export const createProduct = asyncHandler(async (req: AuthRequest, res: Response) => {
  const product = await productsService.createProduct(req.body);
  
  res.status(201).json({
    success: true,
    message: 'Product created successfully',
    data: product,
  });
});

export const updateProduct = asyncHandler(async (req: AuthRequest, res: Response) => {
  const product = await productsService.updateProduct(req.params.id, req.body);
  
  res.json({
    success: true,
    message: 'Product updated successfully',
    data: product,
  });
});

export const deleteProduct = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await productsService.deleteProduct(req.params.id);
  
  res.json({
    success: true,
    message: result.message,
  });
});