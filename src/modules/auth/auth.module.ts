import { MiddlewareConsumer, Module } from '@nestjs/common';
import { LoggerMiddleware, ReqCtxMiddleware } from '@/middlewares';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { SharedModule } from '../shared/shared.module';
import { RepositoryModule } from '../repository';

@Module({
  imports: [SharedModule, RepositoryModule],
  providers: [AuthService],
  controllers: [AuthController],
})
export class UserModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ReqCtxMiddleware).forRoutes(AuthController).apply(LoggerMiddleware).forRoutes(AuthController);
  }
}
