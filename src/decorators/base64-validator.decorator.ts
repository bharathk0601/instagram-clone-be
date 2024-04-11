import { BadRequestException, Injectable } from '@nestjs/common';
import { registerDecorator, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

import { Utils } from '@/shared/utils';
import { FileTypes } from '@/shared/enums';

interface IBase64Validator {
  type: FileTypes;
  size: number;
}

/**
 *
 * @param {ValidationOptions} validationoptions
 * @returns
 */
export function ValidateBase64(validationoptions: IBase64Validator) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'ValidateBase64',
      target: object.constructor,
      propertyName: propertyName,
      validator: new Base64Validator(validationoptions),
    });
  };
}

@ValidatorConstraint({ name: 'Base64Validator' })
@Injectable()
export class Base64Validator implements ValidatorConstraintInterface {
  private readonly validationOtions;

  constructor(validationOtions: IBase64Validator) {
    this.validationOtions = validationOtions;
  }

  /**
   *
   * @param {ValidationArguments} base64
   * @param  {ValidationArguments} args
   */
  validate(base64: string): boolean | never {
    const type = Utils.getMediaType(base64);
    const size = Utils.getFileSize(base64);

    if (type !== this.validationOtions.type) {
      throw new BadRequestException('Invalid file type.');
    }
    if (size > this.validationOtions.size) {
      throw new BadRequestException('File size exceeded.');
    }

    return true;
  }
}
