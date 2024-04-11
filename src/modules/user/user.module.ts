import { MiddlewareConsumer, Module } from '@nestjs/common';
import { LoggerMiddleware, ReqCtxMiddleware } from '@/middlewares';

import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ReqCtxMiddleware).forRoutes(UserController).apply(LoggerMiddleware).forRoutes(UserController);
  }
}
