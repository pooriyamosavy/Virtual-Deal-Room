import { Global, Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core';
import { AuthGuard } from '../guard/auth.guard';
import { ClassSerializerInterceptor } from '@nestjs/common';
import { allExceptionFilter } from '../filter/all-exception.filter';
import { HttpExceptionFilter } from '../filter/http-exception.filter';
import { TypeOrmExceptionFilter } from '../filter/typeorm-exception.filter';
import { UserModule } from 'src/routes/user/user.module';

@Global()
@Module({
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: allExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: TypeOrmExceptionFilter,
    },
  ],
  imports: [UserModule],
  exports: [],
})
export class CoreModule {}
