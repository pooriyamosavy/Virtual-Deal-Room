import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class allExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let message = 'Internal server error';
    let statusCode = 500;

    if (exception.response) {
      message = exception.response.message || message;
      statusCode = exception.response.statusCode || statusCode;
    } else if (exception.message) {
      message = exception.message;
    }

    console.error({ exception });

    response.status(statusCode).json({
      statusCode,
      message,
    });
  }
}
