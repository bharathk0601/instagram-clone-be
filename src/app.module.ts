import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DbConfig, ThrottleConfig } from '@/config';

import { UserModule } from './modules/user/auth.module';
import { PostModule } from './modules/post/post.module';
import { LikeModule } from './modules/like/like.module';
import { CommentModule } from './modules/comment/comment.module';
import { StatusModule } from './modules/status/status.module';
import { SharedModule } from './modules/shared/shared.module';
import { RepositoryModule } from './modules/repository/repository.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(DbConfig),
    ThrottlerModule.forRoot(ThrottleConfig),
    UserModule,
    PostModule,
    LikeModule,
    CommentModule,
    StatusModule,
    SharedModule,
    RepositoryModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
