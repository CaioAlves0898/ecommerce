import prisma from '../../prisma/client';
import { AppError } from '../../middleware/errorHandler';
import { CreateCategoryInput, UpdateCategoryInput } from './categories.validation';

export const getCategories = async (page: number | string = 1, limit: number | string = 10, search?: string) => {
  const pageNum = Number(page) || 1;
  const limitNum = Number(limit) || 10;

  const where = search ? {
    OR: [
      { name: { contains: search, mode: 'insensitive' as const } },
      { slug: { contains: search, mode: 'insensitive' as const } },
    ],
  } : {};

  const [categories, total] = await Promise.all([
    prisma.category.findMany({
      where,
      include: {
        _count: { select: { products: true } },
      },
      skip: (pageNum - 1) * limitNum,
      take: limitNum,
      orderBy: { name: 'asc' },
    }),
    prisma.category.count({ where }),
  ]);

  return {
    data: categories,
    meta: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    },
  };
};

export const getCategoryById = async (id: string) => {
  const category = await prisma.category.findUnique({
    where: { id },
    include: {
      products: {
        select: {
          id: true,
          name: true,
          price: true,
          stock: true,
        },
      },
    },
  });

  if (!category) {
    throw new AppError(404, 'Category not found');
  }

  return category;
};

export const getCategoryBySlug = async (slug: string) => {
  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      products: {
        select: {
          id: true,
          name: true,
          price: true,
          stock: true,
        },
      },
    },
  });

  if (!category) {
    throw new AppError(404, 'Category not found');
  }

  return category;
};

export const createCategory = async (input: CreateCategoryInput) => {
  const existing = await prisma.category.findFirst({
    where: {
      OR: [{ name: input.name }, { slug: input.slug }],
    },
  });

  if (existing) {
    throw new AppError(409, 'Category with this name or slug already exists');
  }

  return prisma.category.create({
    data: input,
  });
};

export const updateCategory = async (id: string, input: UpdateCategoryInput) => {
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) {
    throw new AppError(404, 'Category not found');
  }

  if (input.name || input.slug) {
    const existing = await prisma.category.findFirst({
      where: {
        OR: [
          { name: input.name },
          { slug: input.slug },
        ],
        NOT: { id },
      },
    });
    if (existing) {
      throw new AppError(409, 'Category with this name or slug already exists');
    }
  }

  return prisma.category.update({
    where: { id },
    data: input,
  });
};

export const deleteCategory = async (id: string) => {
  const category = await prisma.category.findUnique({
    where: { id },
    include: { _count: { select: { products: true } } },
  });

  if (!category) {
    throw new AppError(404, 'Category not found');
  }

  if (category._count.products > 0) {
    throw new AppError(400, 'Cannot delete category with products. Move or delete products first.');
  }

  await prisma.category.delete({ where: { id } });
  return { message: 'Category deleted successfully' };
};