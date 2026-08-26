import bcrypt from 'bcryptjs';
import prisma from '../../prisma/client';
import { AppError } from '../../middleware/errorHandler';
import { UpdateUserInput, ChangePasswordInput } from './users.validation';

export const getUsers = async (page: number | string = 1, limit: number | string = 10, search?: string) => {
  const pageNum = Number(page) || 1;
  const limitNum = Number(limit) || 10;

  const where = search ? {
    OR: [
      { name: { contains: search, mode: 'insensitive' as const } },
      { email: { contains: search, mode: 'insensitive' as const } },
    ],
  } : {};

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
      skip: (pageNum - 1) * limitNum,
      take: limitNum,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.user.count({ where }),
  ]);

  return {
    data: users,
    meta: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    },
  };
};

export const getUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
      _count: { select: { orders: true } },
    },
  });

  if (!user) {
    throw new AppError(404, 'User not found');
  }

  return user;
};

export const updateUser = async (id: string, input: UpdateUserInput) => {
  if (input.email) {
    const existingUser = await prisma.user.findUnique({
      where: { email: input.email },
    });
    if (existingUser && existingUser.id !== id) {
      throw new AppError(409, 'Email already in use');
    }
  }

  const user = await prisma.user.update({
    where: { id },
    data: input,
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
    },
  });

  return user;
};

export const changePassword = async (id: string, input: ChangePasswordInput) => {
  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    throw new AppError(404, 'User not found');
  }

  const isValid = await bcrypt.compare(input.currentPassword, user.passwordHash);
  if (!isValid) {
    throw new AppError(401, 'Current password is incorrect');
  }

  const newPasswordHash = await bcrypt.hash(input.newPassword, 12);

  await prisma.user.update({
    where: { id },
    data: { passwordHash: newPasswordHash },
  });

  return { message: 'Password changed successfully' };
};

export const deleteUser = async (id: string) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    throw new AppError(404, 'User not found');
  }

  await prisma.user.delete({ where: { id } });
  return { message: 'User deleted successfully' };
};