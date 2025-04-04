import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';

export type RedisKey = Record<
  string,
  string | number | null | undefined | boolean | object
>;

@Injectable()
export class RedisService {
  constructor(@Inject('RedisClient') private readonly redisClient: Redis) {
    // this.redisClient.flushall();
  }

  async set<T>(prefix: string, key: RedisKey, value: T) {
    console.log('saved in redis', {
      key: this.getKey(prefix, key),
      value: JSON.stringify(value),
    });

    return await this.redisClient.set(
      this.getKey(prefix, key),
      JSON.stringify(value),
    );
  }

  async get<T>(prefix: string, key: RedisKey): Promise<T | null> {
    const result = await this.redisClient.get(this.getKey(prefix, key));
    console.log('fetched from redis', {
      key: this.getKey(prefix, key),
      value: result,
    });
    return result ? JSON.parse(result) : null;
  }

  async del(prefix: string, key: RedisKey): Promise<number> {
    console.log('removing key', { key: this.getKey(prefix, key) });
    const delArg = this.getKey(prefix, key) || [];
    return await this.redisClient.del(...delArg);
  }

  async flushPrefix(prefix: string) {
    console.log('removing all keys with prefix', { prefix });
    const allkeys = await this.redisClient.keys(prefix + '*');
    if (allkeys.length) {
      return await this.redisClient.del(...allkeys);
    }
    return;
  }

  async getCallback<T>(
    prefix: string,
    key: RedisKey,
    callback: () => Promise<T | null> | T | null,
    EntityClass?: new (...args: any[]) => T,
  ) {
    console.log('getCallback');
    const cachedValue = await this.get<T>(prefix, key);
    console.log({ cachedValue });
    if (cachedValue)
      return EntityClass ? new EntityClass(cachedValue) : cachedValue;

    const fetchedValue = await callback();
    if (fetchedValue) {
      this.set<T>(prefix, key, fetchedValue);
    }
    return fetchedValue;
  }

  async createCallback<T>(
    prefix: string,
    key: RedisKey,
    callback: () => Promise<T>,
  ) {
    const newValue = await callback();

    await this.flushPrefix(prefix + 's');
    await this.set(prefix, key, newValue);

    return newValue;
  }

  async updateCallback<T>(
    prefix: string,
    key: RedisKey,
    callback: () => Promise<any>,
    newValue: T,
  ) {
    await callback();
    await this.flushPrefix(prefix);
    await this.flushPrefix(prefix + 's');
    await this.set(prefix, key, newValue);
  }

  async deleteCallback<T>(
    prefix: string,
    key: RedisKey,
    callback: () => Promise<any>,
  ) {
    await callback();
    await this.flushPrefix(prefix);
  }

  private getKey(prefix: string, key?: RedisKey): string {
    if (!key) return prefix;

    const flattenObject = (
      obj: Record<string, any>,
      parentKey = '',
    ): Record<string, string> => {
      return Object.entries(obj).reduce(
        (acc, [k, v]) => {
          const newKey = parentKey ? `${parentKey}-${k}` : k;
          if (v && typeof v === 'object' && !Array.isArray(v)) {
            Object.assign(acc, flattenObject(v, newKey));
          } else {
            acc[newKey] = String(v);
          }
          return acc;
        },
        {} as Record<string, string>,
      );
    };

    const flatKey = flattenObject(key);

    const queryString = Object.entries(flatKey)
      .filter(
        ([k, v]) =>
          v !== null && v !== undefined && v !== 'null' && v !== 'undefined',
      )
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
      .join('&');

    return queryString ? `${prefix}?${queryString}` : prefix;
  }
}
