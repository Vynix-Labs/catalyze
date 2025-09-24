import Redis from 'ioredis';
import env from './env';

export const redis = new Redis({
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  password: env.REDIS_PASSWORD || undefined,
  db: env.REDIS_DB,
  lazyConnect: true,
  maxRetriesPerRequest: null,
});

// Redis connection event handlers
redis.on('connect', () => {
  console.log('✅ Connected to Redis');
});

redis.on('error', (err) => {
  console.error('❌ Redis connection error:', err);
});

redis.on('ready', () => {
  console.log('🚀 Redis is ready to receive commands');
});

redis.on('close', () => {
  console.log('📴 Redis connection closed');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down Redis connection...');
  await redis.quit();
});

process.on('SIGTERM', async () => {
  console.log('Shutting down Redis connection...');
  await redis.quit();
});

export default redis;
