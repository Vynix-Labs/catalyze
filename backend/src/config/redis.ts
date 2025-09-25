import Redis from 'ioredis';
import env from './env';

// Common Redis options used for both URL and host/port forms
const commonOptions = {
  lazyConnect: true,
  maxRetriesPerRequest: null,
};

// Prefer REDIS_URL if provided; else fall back to individual fields
export const redis = (() => {
  if (env.REDIS_URL && env.REDIS_URL.length > 0) {
    let tlsOption: Record<string, unknown> | undefined;
    try {
      const u = new URL(env.REDIS_URL);
      const sslParam = u.searchParams.get('ssl') ?? u.searchParams.get('tls');
      if (u.protocol === 'rediss:' || (sslParam && sslParam !== 'false' && sslParam !== '0')) {
        tlsOption = {};
      }
    } catch {
      // If URL parsing fails, proceed without TLS override; ioredis will still attempt the URL
    }

    return new Redis(env.REDIS_URL, {
      ...commonOptions,
      ...(tlsOption ? { tls: tlsOption } : {}),
    });
  }

  return new Redis({
    host: env.REDIS_HOST,
    port: env.REDIS_PORT,
    password: env.REDIS_PASSWORD || undefined,
    db: env.REDIS_DB,
    ...commonOptions,
  });
})();

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
