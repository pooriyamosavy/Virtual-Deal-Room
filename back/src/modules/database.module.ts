import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Redis from 'ioredis';
import { User } from '../entities/user.entities';
import { UserSession } from '../entities/user-session.entities';
import { FactoryProvider } from '@nestjs/common';

export const redisClientFactory: FactoryProvider<Redis> = {
  provide: 'RedisClient',
  useFactory: async () => {
    const redisInstance = new Redis({
      host: process.env.REDIS_HOST!,
      port: +process.env.REDIS_PORT!,
      password: process.env.REDIS_PASSWORD!,
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000); // Delay between reconnection attempts
        return delay;
      },
      reconnectOnError: (err) => {
        console.log(err.message);
        if (err.message.includes('READONLY')) {
          return false;
        }
        return true;
      },
    });

    redisInstance.on('error', (e) => {
      throw new Error(`Redis connection failed: ${e}`);
    });

    return redisInstance;
  },
};

@Global()
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URI,
      autoLoadEntities: true,
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User, UserSession]),
  ],
  providers: [redisClientFactory],
  exports: [TypeOrmModule, 'RedisClient'],
})
export class DatabaseCacheModule {}
