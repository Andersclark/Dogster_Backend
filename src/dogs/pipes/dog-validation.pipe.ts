import { PipeTransform } from '@nestjs/common';

// TODO: This should actually verify contents.
export class DogValidationPipe implements PipeTransform {
  transform(value: any): any {
    return value;
  }
}
