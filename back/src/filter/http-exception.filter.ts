import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let message = 'Internal server error';
    let statusCode = 500;

    const exceptionResponse = exception.getResponse();

    if (typeof exceptionResponse === 'object' && exceptionResponse) {
      message = (exceptionResponse as any).message || message;
      statusCode = (exceptionResponse as any).statusCode || statusCode;
    } else if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
    }

    response.status(statusCode).json({
      statusCode,
      message,
    });
  }
}
