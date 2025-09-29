import { redis } from '../../config/redis';

export interface CacheOptions {
  ttl?: number; // Time to live in seconds
  prefix?: string; // Key prefix
}

export class Cache {
  private prefix: string;

  constructor(prefix = 'cache') {
    this.prefix = prefix;
  }

  private getKey(key: string): string {
    return `${this.prefix}:${key}`;
  }

  /**
   * Get a value from cache
   */
  async get<T = unknown>(key: string): Promise<T | null> {
    try {
      const cached = await redis.get(this.getKey(key));
      if (!cached) return null;

      return JSON.parse(cached);
    } catch (error) {
      console.error(`Cache get error for key ${key}:`, error);
      return null;
    }
  }

  /**
   * Set a value in cache
   */
  async set<T = unknown>(key: string, value: T, options?: CacheOptions): Promise<boolean> {
    try {
      const serialized = JSON.stringify(value);
      const cacheKey = this.getKey(key);

      if (options?.ttl) {
        await redis.setex(cacheKey, options.ttl, serialized);
      } else {
        await redis.set(cacheKey, serialized);
      }

      return true;
    } catch (error) {
      console.error(`Cache set error for key ${key}:`, error);
      return false;
    }
  }

  /**
   * Delete a value from cache
   */
  async del(key: string): Promise<boolean> {
    try {
      await redis.del(this.getKey(key));
      return true;
    } catch (error) {
      console.error(`Cache del error for key ${key}:`, error);
      return false;
    }
  }

  /**
   * Check if a key exists in cache
   */
  async exists(key: string): Promise<boolean> {
    try {
      const exists = await redis.exists(this.getKey(key));
      return exists === 1;
    } catch (error) {
      console.error(`Cache exists error for key ${key}:`, error);
      return false;
    }
  }

  /**
   * Set a value only if key doesn't exist (atomic operation)
   */
  async setNX<T = unknown>(key: string, value: T, options?: CacheOptions): Promise<boolean> {
    try {
      const serialized = JSON.stringify(value);
      const cacheKey = this.getKey(key);

      let result: number;
      if (options?.ttl) {
        // For TTL, we need to use Lua script since SET NX EX is not directly supported
        result = await redis.eval(`
          local key = KEYS[1]
          local value = ARGV[1]
          local ttl = ARGV[2]
          if redis.call('exists', key) == 0 then
            redis.call('setex', key, ttl, value)
            return 1
          else
            return 0
          end
        `, 1, cacheKey, serialized, options.ttl.toString()) as number;
      } else {
        result = await redis.setnx(cacheKey, serialized);
      }

      return result === 1;
    } catch (error) {
      console.error(`Cache setNX error for key ${key}:`, error);
      return false;
    }
  }

  /**
   * Get or set a value (cache miss handler)
   */
  async getOrSet<T = unknown>(
    key: string,
    getter: () => Promise<T>,
    options?: CacheOptions
  ): Promise<T> {
    let value = await this.get<T>(key);

    if (value === null) {
      value = await getter();
      await this.set(key, value, options);
    }

    return value;
  }

  /**
   * Increment a numeric value
   */
  async incr(key: string, amount = 1): Promise<number> {
    try {
      return await redis.incrby(this.getKey(key), amount);
    } catch (error) {
      console.error(`Cache incr error for key ${key}:`, error);
      throw error;
    }
  }

  /**
   * Decrement a numeric value
   */
  async decr(key: string, amount = 1): Promise<number> {
    try {
      return await redis.decrby(this.getKey(key), amount);
    } catch (error) {
      console.error(`Cache decr error for key ${key}:`, error);
      throw error;
    }
  }

  /**
   * Set expiration time on a key
   */
  async expire(key: string, ttl: number): Promise<boolean> {
    try {
      const result = await redis.expire(this.getKey(key), ttl);
      return result === 1;
    } catch (error) {
      console.error(`Cache expire error for key ${key}:`, error);
      return false;
    }
  }

  /**
   * Get remaining TTL for a key
   */
  async ttl(key: string): Promise<number> {
    try {
      return await redis.ttl(this.getKey(key));
    } catch (error) {
      console.error(`Cache ttl error for key ${key}:`, error);
      return -1;
    }
  }

  /**
   * Clear all cache entries with this prefix
   */
  async clear(): Promise<boolean> {
    try {
      const keys = await redis.keys(`${this.prefix}:*`);
      if (keys.length > 0) {
        await redis.del(...keys);
      }
      return true;
    } catch (error) {
      console.error(`Cache clear error:`, error);
      return false;
    }
  }

  /**
   * Get cache statistics
   */
  async stats(): Promise<{
    keys: number;
    memory?: string;
  }> {
    try {
      const keys = await redis.keys(`${this.prefix}:*`);
      return {
        keys: keys.length,
      };
    } catch (error) {
      console.error('Cache stats error:', error);
      return { keys: 0 };
    }
  }
}

// Default cache instance
export const cache = new Cache();

// Specialized cache instances for different purposes
export const userCache = new Cache('user');
export const sessionCache = new Cache('session');
export const apiCache = new Cache('api');

export default cache;
