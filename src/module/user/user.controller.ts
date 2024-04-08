import { Controller, Get, HttpStatus, Post, Query } from '@nestjs/common';
import { TestDTO, getErrResSchema } from '@/shared/dtos';
import { ApiResponse } from '@nestjs/swagger';
import { UserService } from './user.service';
import { Ctx } from '@/decorators/req-ctx.decorator';

@ApiResponse(getErrResSchema(HttpStatus.UNAUTHORIZED))
@ApiResponse(getErrResSchema(HttpStatus.BAD_REQUEST))
@ApiResponse(getErrResSchema(HttpStatus.TOO_MANY_REQUESTS))
@ApiResponse(getErrResSchema(HttpStatus.REQUEST_TIMEOUT))
@ApiResponse(getErrResSchema(HttpStatus.INTERNAL_SERVER_ERROR))
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUser(@Query() dto: TestDTO) {
    return { message: 'hello from users', dto };
  }

  @Post('/signUp')
  signUp(@Ctx() ctx: ReqCtx) {
    return this.userService.signUp(ctx, null);
  }
}
