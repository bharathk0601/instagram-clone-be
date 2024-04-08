import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

import { Utils } from '@/shared/utils';

@Catch()
export class UnCaughtExceptionFilter<T> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {
    const req: Request = host.switchToHttp().getRequest();
    const res: Response = host.switchToHttp().getResponse();

    const error = exception['response'];
    const status = HttpStatus[HttpStatus[exception['status']]] || HttpStatus[HttpStatus[error?.statusCode]];

    if (status && error) {
      if (Array.isArray(error.message)) {
        error.message = error.message[0];
      }
      return res.status(status).json(typeof error === 'object' ? error : { message: error });
    }

    req.ctx.logger.error(`uncaught exception | ${Utils.stringify(exception)}`);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Something went wrong!' });
  }
}
