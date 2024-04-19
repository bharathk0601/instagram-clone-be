import { Body, Controller, Get, HttpStatus, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

import {
  getErrResSchema,
  SignUpReqTO,
  MessageDTO,
  EmailOTPGenReqDTO,
  EmailOTPVerifyReqDTO,
  ResetPasswordTokenGenReqDTO,
  ResetPasswordReqDTO,
  LoginReqDTO,
  LoginResDTO,
} from '@/shared/dtos';
import { Ctx } from '@/decorators/req-ctx.decorator';

import { AuthService } from './auth.service';
import { JwtAuthGuard } from '@/guards/auth/jwt-auth.guard';

@ApiTags('Auth')
@ApiResponse(getErrResSchema(HttpStatus.BAD_REQUEST))
@ApiResponse(getErrResSchema(HttpStatus.TOO_MANY_REQUESTS))
@ApiResponse(getErrResSchema(HttpStatus.REQUEST_TIMEOUT))
@ApiResponse(getErrResSchema(HttpStatus.INTERNAL_SERVER_ERROR))
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   *
   * @param {SignUpReqTO} signUpReq
   * @param {ReqCtx} ctx
   * @returns {Promise<MessageDTO>}
   */
  @ApiResponse({ status: HttpStatus.CREATED, type: MessageDTO })
  @Post('/signUp')
  signUp(@Body() signUpReq: SignUpReqTO, @Ctx() ctx: ReqCtx): Promise<MessageDTO> {
    return this.authService.signUp(ctx, signUpReq);
  }

  /**
   *
   * @param {EmailOTPGenReqDTO} signUpReq
   * @param {ReqCtx} ctx
   * @returns {Promise<MessageDTO>}
   */
  @ApiResponse({ status: HttpStatus.CREATED, type: MessageDTO })
  @Post('/genEmailOTP')
  generateEmailOTP(@Body() emailOtpGenReq: EmailOTPGenReqDTO, @Ctx() ctx: ReqCtx): Promise<MessageDTO> {
    return this.authService.generateEmailOTP(ctx, emailOtpGenReq);
  }

  /**
   *
   * @param {EmailOTPGenReqDTO} signUpReq
   * @param {ReqCtx} ctx
   * @returns {Promise<MessageDTO>}
   */
  @ApiResponse({ status: HttpStatus.CREATED, type: MessageDTO })
  @Post('/verifyEmailOTP')
  verifyEmailOTP(@Body() emailOtpVerifyReq: EmailOTPVerifyReqDTO, @Ctx() ctx: ReqCtx): Promise<MessageDTO> {
    return this.authService.verifyEmailOTP(ctx, emailOtpVerifyReq);
  }

  /**
   *
   * @param {ResetPasswordTokenGenReqDTO} resetPasswordTokenGenReq
   * @param  {ReqCtx} ctx
   * @returns {Promise<MessageDTO>}
   */
  @ApiResponse({ status: HttpStatus.CREATED, type: MessageDTO })
  @Post('/genResetPasswordToken')
  genResetPasswordToken(@Body() resetPasswordTokenGenReq: ResetPasswordTokenGenReqDTO, @Ctx() ctx: ReqCtx) {
    return this.authService.genResetPasswordToken(ctx, resetPasswordTokenGenReq);
  }

  /**
   *
   * @param {ResetPasswordParmsReqDTO} resetPasswordParmsReq
   * @param  {EmailOTPGenReqDTO} resetPasswordBodyReq
   * @param  {ReqCtx} ctx
   * @returns {Promise<MessageDTO>}
   */
  @ApiResponse({ status: HttpStatus.CREATED, type: MessageDTO })
  @Put('/resetPassword')
  resetPassword(@Body() resetPasswordReq: ResetPasswordReqDTO, @Ctx() ctx: ReqCtx) {
    return this.authService.resetPassword(ctx, resetPasswordReq);
  }

  @ApiResponse({ status: HttpStatus.CREATED, type: LoginResDTO })
  @Post('/login')
  login(@Body() loginReq: LoginReqDTO, @Ctx() ctx: ReqCtx) {
    return this.authService.login(ctx, loginReq);
  }

  @Get('/protected')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  protected() {
    return { message: 'hi ' };
  }
}
