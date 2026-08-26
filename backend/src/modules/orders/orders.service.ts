import { Prisma } from '@prisma/client';
import prisma from '../../prisma/client';
import { AppError } from '../../middleware/errorHandler';
import { CreateOrderInput, UpdateOrderStatusInput } from './orders.validation';

export const getOrders = async (userId: string, userRole: string, page = 1, limit = 10, status?: string) => {
  const where: any = {};
  
  if (userRole !== 'ADMIN') {
    where.userId = userId;
  }
  
  if (status) {
    where.status = status;
  }

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        items: {
          include: {
            product: {
              select: { id: true, name: true, images: true },
            },
          },
        },
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.order.count({ where }),
  ]);

  return {
    data: orders,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getOrderById = async (id: string, userId: string, userRole: string) => {
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
      items: {
        include: {
          product: {
            select: { id: true, name: true, price: true, images: true },
          },
        },
      },
    },
  });

  if (!order) {
    throw new AppError(404, 'Order not found');
  }

  if (userRole !== 'ADMIN' && order.userId !== userId) {
    throw new AppError(403, 'Not authorized to view this order');
  }

  return order;
};

export const createOrder = async (userId: string, input: CreateOrderInput) => {
  return await prisma.$transaction(async (tx) => {
    let total = new Prisma.Decimal(0);
    const orderItems: any[] = [];

    for (const item of input.items) {
      const product = await tx.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) {
        throw new AppError(404, `Product ${item.productId} not found`);
      }

      if (product.stock < item.quantity) {
        throw new AppError(400, `Insufficient stock for ${product.name}. Available: ${product.stock}`);
      }

      const itemTotal = new Prisma.Decimal(product.price).mul(item.quantity);
      total = total.add(itemTotal);

      orderItems.push({
        productId: product.id,
        quantity: item.quantity,
        price: product.price,
      });

      await tx.product.update({
        where: { id: product.id },
        data: { stock: { decrement: item.quantity } },
      });
    }

    const order = await tx.order.create({
      data: {
        userId,
        total,
        items: { create: orderItems },
      },
      include: {
        items: {
          include: {
            product: { select: { id: true, name: true, images: true } },
          },
        },
      },
    });

    return order;
  });
};

export const updateOrderStatus = async (id: string, input: UpdateOrderStatusInput) => {
  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) {
    throw new AppError(404, 'Order not found');
  }

  if (order.status === 'CANCELLED' && input.status !== 'CANCELLED') {
    throw new AppError(400, 'Cannot change status of cancelled order');
  }

  if (order.status === 'DELIVERED' && input.status !== 'DELIVERED') {
    throw new AppError(400, 'Cannot change status of delivered order');
  }

  return prisma.order.update({
    where: { id },
    data: { status: input.status },
    include: {
      user: { select: { id: true, name: true, email: true } },
      items: {
        include: {
          product: { select: { id: true, name: true, images: true } },
        },
      },
    },
  });
};

export const cancelOrder = async (id: string, userId: string, userRole: string) => {
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });

  if (!order) {
    throw new AppError(404, 'Order not found');
  }

  if (userRole !== 'ADMIN' && order.userId !== userId) {
    throw new AppError(403, 'Not authorized to cancel this order');
  }

  if (order.status === 'DELIVERED') {
    throw new AppError(400, 'Cannot cancel delivered order');
  }

  if (order.status === 'CANCELLED') {
    throw new AppError(400, 'Order already cancelled');
  }

  return await prisma.$transaction(async (tx) => {
    for (const item of order.items) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { increment: item.quantity } },
      });
    }

    return tx.order.update({
      where: { id },
      data: { status: 'CANCELLED' },
      include: {
        items: {
          include: {
            product: { select: { id: true, name: true, images: true } },
          },
        },
      },
    });
  });
};