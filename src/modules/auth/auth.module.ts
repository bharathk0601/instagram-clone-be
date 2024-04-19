import { MiddlewareConsumer, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { LoggerMiddleware, ReqCtxMiddleware } from '@/middlewares';
import { JwtConfig } from '@/config';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { SharedModule } from '../shared/shared.module';
import { RepositoryModule } from '../repository';

@Module({
  imports: [SharedModule, RepositoryModule, JwtModule.register(JwtConfig)],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ReqCtxMiddleware).forRoutes(AuthController).apply(LoggerMiddleware).forRoutes(AuthController);
  }
}
