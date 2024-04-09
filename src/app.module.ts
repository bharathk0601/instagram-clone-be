import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DbConfig } from '@/config';
import config from '@/config/config';

import { UserModule } from './module/user/user.module';
import { PostModule } from './module/post/post.module';
import { LikeModule } from './module/like/like.module';
import { CommentModule } from './module/comment/comment.module';
import { StatusModule } from './module/status/status.module';
import { SharedModule } from './module/shared/shared.module';

@Module({
  imports: [
    // TypeOrmModule.forRoot(DbConfig),
    ThrottlerModule.forRoot([{ ttl: config.get('THROTTLE_TTL'), limit: config.get('THROTTLE_LIMIT') }]),
    UserModule,
    PostModule,
    LikeModule,
    CommentModule,
    StatusModule,
    SharedModule,
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
