import { Response } from 'express';
import { config } from '../../config';
import { AuthRequest } from '../../middleware/auth';
import { asyncHandler } from '../../middleware/errorHandler';
import * as authService from './auth.service';

const setRefreshCookie = (res: Response, refreshToken: string) => {
  const isProduction = config.nodeEnv === 'production';
  res.cookie(config.cookie.refreshTokenName, refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/',
  });
};

const clearRefreshCookie = (res: Response) => {
  const isProduction = config.nodeEnv === 'production';
  res.clearCookie(config.cookie.refreshTokenName, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    path: '/',
  });
};

export const register = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { user, tokens } = await authService.register(req.body);
  
  setRefreshCookie(res, tokens.refreshToken);
  
  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: { user, accessToken: tokens.accessToken },
  });
});

export const login = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { user, tokens } = await authService.login(req.body);
  
  setRefreshCookie(res, tokens.refreshToken);
  
  res.json({
    success: true,
    message: 'Login successful',
    data: { user, accessToken: tokens.accessToken },
  });
});

export const refresh = asyncHandler(async (req: AuthRequest, res: Response) => {
  const refreshToken = req.cookies[config.cookie.refreshTokenName];
  
  if (!refreshToken) {
    return res.status(401).json({
      success: false,
      message: 'Refresh token required',
    });
  }

  const tokens = await authService.refresh(refreshToken);
  
  setRefreshCookie(res, tokens.refreshToken);
  
  res.json({
    success: true,
    message: 'Token refreshed',
    data: { accessToken: tokens.accessToken },
  });
});

export const logout = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (req.user) {
    await authService.logout(req.user.id);
  }
  
  clearRefreshCookie(res);
  
  res.json({
    success: true,
    message: 'Logged out successfully',
  });
});

export const getProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await authService.getProfile(req.user!.id);
  
  res.json({
    success: true,
    data: user,
  });
});