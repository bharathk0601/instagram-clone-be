import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DbConfig } from '@/config';
import { config } from '@/config';

import { UserModule } from './modules/user/user.module';
import { PostModule } from './modules/post/post.module';
import { LikeModule } from './modules/like/like.module';
import { CommentModule } from './modules/comment/comment.module';
import { StatusModule } from './modules/status/status.module';
import { SharedModule } from './modules/shared/shared.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(DbConfig),
    ThrottlerModule.forRoot({
      throttlers: [{ ttl: config.get('THROTTLE_TTL'), limit: config.get('THROTTLE_LIMIT') }],
    }),
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
