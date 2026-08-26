import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET!,
    refreshSecret: process.env.JWT_REFRESH_SECRET!,
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },
  
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  
  cookie: {
    secret: process.env.COOKIE_SECRET!,
    refreshTokenName: 'refreshToken',
  },
  
  database: {
    url: process.env.DATABASE_URL!,
  },
};

if (!config.jwt.accessSecret || !config.jwt.refreshSecret || !config.cookie.secret) {
  throw new Error('Missing required environment variables: JWT_ACCESS_SECRET, JWT_REFRESH_SECRET, COOKIE_SECRET');
}