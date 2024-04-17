import { Body, Controller, HttpStatus, Post, Put } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import {
  getErrResSchema,
  SignUpReqTO,
  MessageDTO,
  EmailOTPGenReqDTO,
  EmailOTPVerifyReqDTO,
  ResetPasswordTokenGenReqDTO,
  ResetPasswordReqDTO,
} from '@/shared/dtos';
import { Ctx } from '@/decorators/req-ctx.decorator';

import { AuthService } from './auth.service';

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
}
