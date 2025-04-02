import { Global, Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { JwtModule } from '@nestjs/jwt';

@Global()
@Module({
  imports: [
    NestConfigModule.forRoot({
      envFilePath: '.env.development',
    }),
    CacheModule.register(),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '10d' },
    }),
  ],
  exports: [NestConfigModule, CacheModule, JwtModule],
})
export class ConfigCacheJwtModule {}
