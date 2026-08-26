import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../../config';
import prisma from '../../prisma/client';
import { AppError } from '../../middleware/errorHandler';
import { RegisterInput, LoginInput } from './auth.validation';

export const generateTokens = (user: { id: string; email: string; role: string }) => {
  const accessToken = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    config.jwt.accessSecret,
    { expiresIn: config.jwt.accessExpiresIn } as any
  );

  const refreshToken = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    config.jwt.refreshSecret,
    { expiresIn: config.jwt.refreshExpiresIn } as any
  );

  return { accessToken, refreshToken };
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, config.jwt.refreshSecret) as {
    id: string;
    email: string;
    role: string;
  };
};

export const hashPassword = async (password: string) => {
  return bcrypt.hash(password, 12);
};

export const comparePassword = async (password: string, hash: string) => {
  return bcrypt.compare(password, hash);
};

export const register = async (input: RegisterInput) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (existingUser) {
    throw new AppError(409, 'Email already registered');
  }

  const passwordHash = await hashPassword(input.password);

  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      passwordHash,
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
    },
  });

  const tokens = generateTokens(user);

  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken: tokens.refreshToken },
  });

  return { user, tokens };
};

export const login = async (input: LoginInput) => {
  const user = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (!user) {
    throw new AppError(401, 'Invalid credentials');
  }

  const isValid = await comparePassword(input.password, user.passwordHash);

  if (!isValid) {
    throw new AppError(401, 'Invalid credentials');
  }

  const tokens = generateTokens({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken: tokens.refreshToken },
  });

  return { 
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    tokens,
  };
};

export const refresh = async (refreshToken: string) => {
  let decoded: { id: string; email: string; role: string };
  
  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch {
    throw new AppError(401, 'Invalid refresh token');
  }

  const user = await prisma.user.findUnique({
    where: { id: decoded.id },
  });

  if (!user || user.refreshToken !== refreshToken) {
    throw new AppError(401, 'Invalid refresh token');
  }

  const tokens = generateTokens({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken: tokens.refreshToken },
  });

  return tokens;
};

export const logout = async (userId: string) => {
  await prisma.user.update({
    where: { id: userId },
    data: { refreshToken: null },
  });
};

export const getProfile = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new AppError(404, 'User not found');
  }

  return user;
};