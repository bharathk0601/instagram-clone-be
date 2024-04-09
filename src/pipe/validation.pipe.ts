/* eslint-disable @typescript-eslint/ban-types */

import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { validate, ValidationError, ValidatorOptions } from 'class-validator';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  private readonly validatorOptions: ValidatorOptions = {
    stopAtFirstError: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  };

  constructor(validatorOptions?: ValidatorOptions) {
    this.validatorOptions = { ...this.validatorOptions, ...validatorOptions };
  }

  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToInstance(metatype, value);
    const errors = await validate(object, this.validatorOptions);

    const firstError = errors?.[0];
    let children: ValidationError[] = firstError?.children || [];
    while (children?.length) {
      children = children[0]?.children;
    }

    if (firstError) {
      throw new BadRequestException(firstError.constraints[Object.keys(firstError.constraints)[0]]);
    }
    return value;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
