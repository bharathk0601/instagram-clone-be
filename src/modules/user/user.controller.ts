import { Body, Controller, Get, HttpStatus, Post, Query } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { TestDTO, getErrResSchema } from '@/shared/dtos';
import { Ctx } from '@/decorators/req-ctx.decorator';

import { UserService } from './user.service';
import { FileService } from '../shared/file.service';

@ApiTags('User')
@ApiResponse(getErrResSchema(HttpStatus.UNAUTHORIZED))
@ApiResponse(getErrResSchema(HttpStatus.BAD_REQUEST))
@ApiResponse(getErrResSchema(HttpStatus.TOO_MANY_REQUESTS))
@ApiResponse(getErrResSchema(HttpStatus.REQUEST_TIMEOUT))
@ApiResponse(getErrResSchema(HttpStatus.INTERNAL_SERVER_ERROR))
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly fileSercice: FileService,
  ) {}

  @Post()
  async getUser(@Body() dto: TestDTO, @Ctx() ctx: ReqCtx) {
    return this.fileSercice.uploadProfilePic(dto.name, ctx);
  }

  @Post('/signUp')
  signUp(@Ctx() ctx: ReqCtx) {
    return this.userService.signUp(ctx, null);
  }
}
