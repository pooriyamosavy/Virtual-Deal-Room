import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';

@Catch(QueryFailedError)
export class TypeOrmExceptionFilter implements ExceptionFilter {
  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const message =
      (exception.driverError as any).detail ||
      exception.message ||
      'Database query failed';
    const statusCode = 400;

    response.status(statusCode).json({
      statusCode,
      message: message,
    });
  }
}
