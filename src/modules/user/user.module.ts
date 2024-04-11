import { MiddlewareConsumer, Module } from '@nestjs/common';
import { LoggerMiddleware, ReqCtxMiddleware } from '@/middlewares';

import { UserService } from './user.service';
import { UserController } from './user.controller';
import { SharedModule } from '../shared/shared.module';

@Module({
  imports: [SharedModule],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ReqCtxMiddleware).forRoutes(UserController).apply(LoggerMiddleware).forRoutes(UserController);
  }
}
