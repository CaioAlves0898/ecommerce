import { z } from 'zod';

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(200),
    description: z.string().optional(),
    price: z.number().positive('Price must be positive').max(999999.99),
    stock: z.number().int().min(0).default(0),
    images: z.array(z.string().url()).default([]),
    categoryId: z.string().cuid(),
  }),
});

export const updateProductSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(200).optional(),
    description: z.string().optional(),
    price: z.number().positive().max(999999.99).optional(),
    stock: z.number().int().min(0).optional(),
    images: z.array(z.string().url()).optional(),
    categoryId: z.string().cuid().optional(),
  }),
  params: z.object({
    id: z.string().cuid(),
  }),
});

export const productParamsSchema = z.object({
  params: z.object({
    id: z.string().cuid(),
  }),
});

export const productQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10),
    search: z.string().optional(),
    categoryId: z.string().optional(),
    minPrice: z.coerce.number().positive().optional(),
    maxPrice: z.coerce.number().positive().optional(),
    sortBy: z.enum(['name', 'price', 'createdAt']).default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
    inStock: z.coerce.boolean().optional(),
  }).passthrough(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>['body'];
export type UpdateProductInput = z.infer<typeof updateProductSchema>['body'];
export type ProductQueryInput = z.infer<typeof productQuerySchema>['query'];