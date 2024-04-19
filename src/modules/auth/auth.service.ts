import { BadRequestException, ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';

import {
  MessageDTO,
  SignUpReqTO,
  EmailOTPGenReqDTO,
  EmailOTPVerifyReqDTO,
  ResetPasswordTokenGenReqDTO,
  ResetPasswordReqDTO,
  LoginReqDTO,
  LoginResDTO,
} from '@/shared/dtos';
import { TUser, TUserProfile } from '@/shared/entities';
import { Utils } from '@/shared/utils';
import { APP_CONSTANTS } from '@/shared/constants';
import { config, redis } from '@/config';

import { UserRepository } from '../repository';
import { MailerService } from '../shared/mailer.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly mailerService: MailerService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   *
   * @param {ReqCtx} ctx
   * @param {SignUpReqTO} signUpReq
   * @returns {Promise<MessageDTO>}
   */
  public async signUp(ctx: ReqCtx, signUpReq: SignUpReqTO): Promise<MessageDTO> {
    const currentUser = await this.userRepository.findUser({ email: signUpReq.email, isDeleted: false }, { email: true });
    if (currentUser?.email) {
      throw new ConflictException('EmailId already exists.');
    }

    const isEmailValid = await this.mailerService.isEmailValid(signUpReq.email, ctx);
    if (!isEmailValid) {
      throw new BadRequestException('Invalid EmailId.');
    }

    const hashedPassword = await Utils.hash(signUpReq.password);
    const userId = Utils.genUUID(APP_CONSTANTS.USER_ID_LEN);
    const user: TUser = { userId: userId, email: signUpReq.email, password: hashedPassword };

    const userProfile: TUserProfile = {
      uaserName: signUpReq.userName,
      name: signUpReq.name,
    };
    const isSignUpSuccess = await this.userRepository.signUp(user, userProfile, ctx);
    ctx.logger.log(`isSignUpSuccess | ${isSignUpSuccess} | ${userId}`);
    ctx.logger.updateContext(`userId | ${userId}`);

    if (!isSignUpSuccess) {
      throw new InternalServerErrorException();
    }

    return { message: 'created user successfully.' };
  }

  /**
   *
   * @param {ReqCtx} ctx
   * @param {EmailOTPGenReqDTO} emailOtpGenReq
   * @returns {Promise<MessageDTO>}
   */
  public async generateEmailOTP(ctx: ReqCtx, emailOtpGenReq: EmailOTPGenReqDTO): Promise<MessageDTO> {
    const currentUser = await this.userRepository.findUser(
      { email: emailOtpGenReq.email, isDeleted: false },
      { email: true, password: true, userId: true },
    );
    if (!currentUser) {
      throw new BadRequestException('Please signup first.');
    }
    ctx.logger.updateContext(`userId | ${currentUser.userId}`);

    if (!(await Utils.compareHash(emailOtpGenReq.password, currentUser.password))) {
      throw new BadRequestException('Invalid email or password.');
    }

    const otp = Utils.genRandNo(4);
    const hashedOtp = await Utils.hash(otp);

    let currentUserToken = (await this.userRepository.findUserToken({ userId: currentUser.userId }, { id: true })) || {};
    currentUserToken = {
      userId: currentUser.userId,
      ...currentUserToken,
      verificationCode: hashedOtp,
      verificationCodeCreatedAt: new Date(),
    };
    await this.userRepository.saveUserToken(currentUserToken);

    await this.mailerService.verifyEmail(currentUser.email, otp);
    return { message: 'success.' };
  }

  /**
   *
   * @param {ReqCtx} ctx
   * @param {EmailOTPVerifyReqDTO} emailOtpVerifyReq
   * @returns {Promise<MessageDTO>}
   */
  public async verifyEmailOTP(ctx: ReqCtx, emailOtpVerifyReq: EmailOTPVerifyReqDTO): Promise<MessageDTO> {
    const currentUser = await this.userRepository.findUser(
      { email: emailOtpVerifyReq.email, isDeleted: false },
      { email: true, userId: true, password: true },
    );
    if (!currentUser) {
      throw new BadRequestException('Please signup first.');
    }
    ctx.logger.updateContext(`userId | ${currentUser.userId}`);

    if (!(await Utils.compareHash(emailOtpVerifyReq.password, currentUser.password))) {
      throw new BadRequestException('Invalid email or password.');
    }

    const userToken = await this.userRepository.findUserToken(
      { userId: currentUser.userId },
      { verificationCode: true, verificationCodeCreatedAt: true },
    );

    if (!userToken) {
      throw new BadRequestException('Invalid OTP.');
    }

    if (!(await Utils.compareHash(emailOtpVerifyReq.otp, userToken.verificationCode))) {
      throw new BadRequestException('Invalid OTP.');
    }

    const expiryDate = new Date(new Date(userToken.verificationCodeCreatedAt).getTime() + APP_CONSTANTS.OTP_EXPIRY_TIME);
    const currentDate = new Date();
    if (currentDate > expiryDate) {
      await this.userRepository.updateUserToken({ userId: currentUser.userId }, { verificationCode: null, verificationCodeCreatedAt: null });
      throw new BadRequestException('OTP has expired.');
    }

    await this.userRepository.updateUserToken({ userId: currentUser.userId }, { verificationCode: null, verificationCodeCreatedAt: null });
    await this.userRepository.updateUser({ userId: currentUser.userId }, { isVerified: true, isActive: true });

    return { message: 'success.' };
  }

  /**
   *
   * @param  {ReqCtx} ctx
   * @param {ResetPasswordTokenGenReqDTO} resetPasswordTokenGenReq
   * @returns {Promise<MessageDTO>}
   */
  public async genResetPasswordToken(ctx: ReqCtx, resetPasswordTokenGenReq: ResetPasswordTokenGenReqDTO): Promise<MessageDTO> {
    const currentUser = await this.userRepository.findUser(
      { email: resetPasswordTokenGenReq.email, isDeleted: false },
      { email: true, userId: true },
    );
    if (!currentUser) {
      throw new BadRequestException('Invalid Email.');
    }
    ctx.logger.updateContext(`userId | ${currentUser.userId}`);

    const token = crypto.randomBytes(32).toString('hex');
    const hashedToken = await Utils.hash(token);

    const currentUserToken = (await this.userRepository.findUserToken({ userId: currentUser.userId }, { id: true })) || {};
    await this.userRepository.saveUserToken({
      ...currentUserToken,
      userId: currentUser.userId,
      passwordResetToken: hashedToken,
      passwordResetTokenCreatedAt: new Date(),
    });

    const tokenUrl = `${config.get<string>('API_BASE_URL')}/${token}`;
    await this.mailerService.restPasswordToken(resetPasswordTokenGenReq.email, tokenUrl);
    return { message: 'success.' };
  }

  /**
   *
   * @param  {ReqCtx} ctx
   * @param {ResetPasswordTokenVerifyReqDTO} resetPasswordParmsReq
   * @param {EmailOTPGenReqDTO} resetPasswordBodyReq
   * @returns {Promise<MessageDTO>}
   */
  public async resetPassword(ctx: ReqCtx, resetPasswordReq: ResetPasswordReqDTO): Promise<MessageDTO> {
    const currentUser = await this.userRepository.findUser({ email: resetPasswordReq.email, isDeleted: false }, { email: true, userId: true });
    if (!currentUser) {
      throw new BadRequestException('Invalid email or password.');
    }
    ctx.logger.updateContext(`userId | ${currentUser.userId}`);

    const userToken = await this.userRepository.findUserToken(
      { userId: currentUser.userId },
      { passwordResetToken: true, passwordResetTokenCreatedAt: true },
    );
    if (!userToken?.passwordResetToken) {
      throw new BadRequestException('Please request for reset password.');
    }

    if (!(await Utils.compareHash(resetPasswordReq.token, userToken.passwordResetToken))) {
      throw new BadRequestException('Invalid token.');
    }

    const expiryDate = new Date(new Date(userToken.passwordResetTokenCreatedAt).getTime() + APP_CONSTANTS.PASSWORD_TOKEN_EXPIRY_TIME);
    const currentDate = new Date();
    if (currentDate > expiryDate) {
      await this.userRepository.updateUserToken({ userId: currentUser.userId }, { passwordResetToken: null, passwordResetTokenCreatedAt: null });
      throw new BadRequestException('token has expired.');
    }

    await this.userRepository.updateUserToken({ userId: currentUser.userId }, { passwordResetToken: null, passwordResetTokenCreatedAt: null });

    const hashedPassword = await Utils.hash(resetPasswordReq.password);
    await this.userRepository.updateUser({ userId: currentUser.userId }, { password: hashedPassword });

    return { message: 'success.' };
  }

  /**
   *
   * @param {ReqCtx} ctx
   * @param {LoginReqDTO} loginReq
   * @returns {Promise<LoginResDTO>}
   */
  public async login(ctx: ReqCtx, loginReq: LoginReqDTO): Promise<LoginResDTO> {
    const currentUser = await this.userRepository.findUser(
      { email: loginReq.email },
      {
        email: true,
        password: true,
        userId: true,
      },
    );
    if (!currentUser) {
      throw new BadRequestException('Please signup first.');
    }
    ctx.logger.updateContext(`userId | ${currentUser.userId}`);

    if (!(await Utils.compareHash(loginReq.password, currentUser.password))) {
      throw new BadRequestException('Invalid email or password.');
    }

    const tokenId = Utils.genUUID(APP_CONSTANTS.TOKEN_ID_LEN);
    const token = await this.jwtService.signAsync({ userId: currentUser.userId, tokenId });
    await redis.hset(`user_${currentUser.userId}`, 'tokenId', tokenId);

    return { token };
  }
}
