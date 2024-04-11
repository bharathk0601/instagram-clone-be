import { HttpStatus } from '@nestjs/common';
import { ApiProperty, ApiResponseOptions } from '@nestjs/swagger';

export class UnAuthorizedResDTO {
  @ApiProperty({ example: 'Unauthorized' })
  message: string;

  @ApiProperty({ example: true, required: false })
  regenerateToken?: boolean;

  @ApiProperty({ example: HttpStatus.UNAUTHORIZED })
  statusCode: number;
}

export class BadRequestResDTO {
  @ApiProperty({ example: 'name must be longer than or equal to 5 characters' })
  message: string;

  @ApiProperty({ example: 'Bad Request', required: false })
  error?: string;

  @ApiProperty({ example: HttpStatus.BAD_REQUEST })
  statusCode: number;
}

export class TooManyRequestsResDTO {
  @ApiProperty({ example: 'Too Many Requests' })
  message: string;
}

export class InternalServerErrorResDTO {
  @ApiProperty({ example: 'Something went wrong!' })
  message: string;

  @ApiProperty({ example: HttpStatus.INTERNAL_SERVER_ERROR })
  statusCode: number;
}

export class RequestTimeOutResDTO {
  @ApiProperty({ example: 'Request Timeout' })
  message: string;

  @ApiProperty({ example: HttpStatus.REQUEST_TIMEOUT })
  statusCode: number;
}

/**
 *
 * @param {HttpStatus} status
 * @returns {ObjectLiteral}
 */
export function getErrResSchema(status: HttpStatus): ApiResponseOptions {
  switch (status) {
    case HttpStatus.UNAUTHORIZED:
      return { status: status, type: UnAuthorizedResDTO, description: 'Unauthorized' };
    case HttpStatus.BAD_REQUEST:
      return { status: status, type: BadRequestResDTO, description: 'Bad Request' };
    case HttpStatus.TOO_MANY_REQUESTS:
      return { status: status, type: TooManyRequestsResDTO, description: 'Too many Requests' };
    case HttpStatus.REQUEST_TIMEOUT:
      return { status: status, type: InternalServerErrorResDTO, description: 'Request Timeout' };
    case HttpStatus.INTERNAL_SERVER_ERROR:
      return { status: status, type: InternalServerErrorResDTO, description: 'Something went wrong!' };
  }
}
