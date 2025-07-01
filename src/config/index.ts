import dotenv from 'dotenv';

dotenv.config();

if (!process.env.MONGODB_URI) {
  console.error('Preencha o MONGODB_URI no .env');
  process.exit(1);
}

export const config = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  HOST: process.env.HOST || 'localhost',
  MONGODB_URI: process.env.MONGODB_URI!,
  PORT: parseInt(process.env.PORT || '3000', 10),
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
} as const;

export default config;