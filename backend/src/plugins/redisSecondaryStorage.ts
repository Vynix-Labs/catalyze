import { type SecondaryStorage } from 'better-auth';
import { redis } from '../config/redis';

export class RedisSecondaryStorage implements SecondaryStorage {
  private prefix = 'better_auth';

  private getKey(key: string): string {
    return `${this.prefix}:${key}`;
  }

  async get(key: string): Promise<string | null> {
    try {
      const value = await redis.get(this.getKey(key));
      return value;
    } catch (error) {
      console.error(`Redis secondary storage get error for key ${key}:`, error);
      return null;
    }
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    try {
      const cacheKey = this.getKey(key);

      if (ttl) {
        await redis.setex(cacheKey, ttl, value);
      } else {
        await redis.set(cacheKey, value);
      }
    } catch (error) {
      console.error(`Redis secondary storage set error for key ${key}:`, error);
      throw error;
    }
  }

  async delete(key: string): Promise<void> {
    try {
      await redis.del(this.getKey(key));
    } catch (error) {
      console.error(`Redis secondary storage delete error for key ${key}:`, error);
      throw error;
    }
  }

  async clear(): Promise<void> {
    try {
      const keys = await redis.keys(`${this.prefix}:*`);
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    } catch (error) {
      console.error('Redis secondary storage clear error:', error);
      throw error;
    }
  }

  async has(key: string): Promise<boolean> {
    try {
      const exists = await redis.exists(this.getKey(key));
      return exists === 1;
    } catch (error) {
      console.error(`Redis secondary storage has error for key ${key}:`, error);
      return false;
    }
  }
}

// Create and export the Redis secondary storage instance
export const redisSecondaryStorage = new RedisSecondaryStorage();
