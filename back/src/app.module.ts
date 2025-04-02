import {
  ClassSerializerInterceptor,
  FactoryProvider,
  Global,
  Module,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entities';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './routes/user/user.module';
import { AuthModule } from './routes/auth/auth.module';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AuthGuard } from './guard/auth.guard';
import { allExceptionFilter } from './filter/all-exception.filter';
import { HttpExceptionFilter } from './filter/http-exception.filter';
import { TypeOrmExceptionFilter } from './filter/typeorm-exception.filter';
import { JwtModule } from '@nestjs/jwt';
import { TokenService } from './services/token.service';
import { CacheModule } from '@nestjs/cache-manager';
import { UserSession } from './entities/user-session.entities';
import { UserSessionScheduler } from './scheduler/user-session.scheduler';
import { RedisService } from './services/redis.service';
import { UserCrudService } from './services/crud/user-crud.service';
import Redis from 'ioredis';
import { CoreModule } from './modules/core.module';
import { ConfigCacheJwtModule } from './modules/config.module';
import { DatabaseCacheModule } from './modules/database.module';
import { DealModule } from './routes/deal/deal.module';
import { DealCrudService } from './services/crud/deal-crud.service';

export const redisClientFactory: FactoryProvider<Redis> = {
  provide: 'RedisClient',
  useFactory: async () => {
    const redisInstance = new Redis({
      host: process.env.REDIS_HOST!,
      port: +process.env.REDIS_PORT!,
      password: process.env.REDIS_PASSWORD!,
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
    ConfigCacheJwtModule,
    DatabaseCacheModule,
    CoreModule,
    UserModule,
    AuthModule,
    DealModule,
  ],
  providers: [
    TokenService,
    UserSessionScheduler,
    RedisService,
    UserCrudService,
    DealCrudService,
    redisClientFactory,
  ],
  exports: [TokenService, RedisService, UserCrudService, DealCrudService],
})
export class AppModule {}
