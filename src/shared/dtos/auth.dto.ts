import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length, Matches } from 'class-validator';

export class SignUpReqTO {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @Length(3, 30)
  @Matches(/^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/)
  userName: string;

  @ApiProperty()
  @Length(2, 30)
  name: string;

  @ApiProperty()
  @Length(5, 15)
  password: string;
}

export class EmailOTPGenReqDTO {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @Length(5, 15)
  password: string;
}

export class EmailOTPVerifyReqDTO {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @Length(5, 15)
  password: string;

  @ApiProperty({ minLength: 4, maxLength: 4, example: '1034' })
  @Length(4, 4)
  otp: string;
}

export class ResetPasswordTokenGenReqDTO {
  @ApiProperty()
  @IsEmail()
  email: string;
}

export class ResetPasswordReqDTO {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @Length(5, 15)
  password: string;

  @ApiProperty()
  @IsString()
  @Length(64, 64)
  token: string;
}
