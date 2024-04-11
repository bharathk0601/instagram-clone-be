import { ValidateBase64 } from '@/decorators';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';
import { FileTypes } from '../enums';

export class TestDTO {
  @ApiProperty({
    minLength: 5,
  })
  @IsString()
  // @ValidateBase64({ type: FileTypes.IMAGE, size: 80000000 })
  // @MinLength(5)
  name: string;
}
