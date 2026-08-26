import prisma from '../../prisma/client';
import { AppError } from '../../middleware/errorHandler';
import { CreateProductInput, UpdateProductInput, ProductQueryInput } from './products.validation';

export const getProducts = async (query: ProductQueryInput) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const { search, categoryId, minPrice, maxPrice, inStock } = query;
  const sortBy = (query.sortBy as string) || 'createdAt';
  const sortOrder = (query.sortOrder as string) || 'desc';

  const where: any = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  if (categoryId) {
    where.categoryId = categoryId;
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};
    if (minPrice !== undefined) where.price.gte = minPrice;
    if (maxPrice !== undefined) where.price.lte = maxPrice;
  }

  if (inStock) {
    where.stock = { gt: 0 };
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
      },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
      orderBy: { [sortBy]: sortOrder },
    }),
    prisma.product.count({ where }),
  ]);

  return {
    data: products,
    meta: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    },
  };
};

export const getProductById = async (id: string) => {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: {
        select: { id: true, name: true, slug: true },
      },
    },
  });

  if (!product) {
    throw new AppError(404, 'Product not found');
  }

  return product;
};

export const getProductsByCategorySlug = async (slug: string, query: ProductQueryInput) => {
  const category = await prisma.category.findUnique({ where: { slug } });
  if (!category) {
    throw new AppError(404, 'Category not found');
  }

  return getProducts({ ...query, categoryId: category.id });
};

export const createProduct = async (input: CreateProductInput) => {
  const category = await prisma.category.findUnique({
    where: { id: input.categoryId },
  });

  if (!category) {
    throw new AppError(404, 'Category not found');
  }

  return prisma.product.create({
    data: input,
    include: {
      category: { select: { id: true, name: true, slug: true } },
    },
  });
};

export const updateProduct = async (id: string, input: UpdateProductInput) => {
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) {
    throw new AppError(404, 'Product not found');
  }

  if (input.categoryId) {
    const category = await prisma.category.findUnique({
      where: { id: input.categoryId },
    });
    if (!category) {
      throw new AppError(404, 'Category not found');
    }
  }

  return prisma.product.update({
    where: { id },
    data: input,
    include: {
      category: { select: { id: true, name: true, slug: true } },
    },
  });
};

export const deleteProduct = async (id: string) => {
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) {
    throw new AppError(404, 'Product not found');
  }

  await prisma.product.delete({ where: { id } });
  return { message: 'Product deleted successfully' };
};

export const updateStock = async (id: string, quantity: number) => {
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) {
    throw new AppError(404, 'Product not found');
  }

  const newStock = product.stock + quantity;
  if (newStock < 0) {
    throw new AppError(400, 'Insufficient stock');
  }

  return prisma.product.update({
    where: { id },
    data: { stock: newStock },
  });
};