import { registerDecorator, ValidationOptions } from 'class-validator';
import { isAddress } from '../../common';

export function IsAddress(options: ValidationOptions = {}) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      propertyName,
      options: {
        message: `${propertyName} must be an address`,
        ...options,
      },
      name: 'isAddress',
      target: object ? object.constructor : undefined,
      constraints: [],
      validator: {
        validate(value: any): boolean {
          return isAddress(value);
        },
      },
    });
  };
}
