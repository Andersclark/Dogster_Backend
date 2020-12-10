import { PipeTransform } from "@nestjs/common";

export class DogValidationPipe implements PipeTransform {
  transform(value: any ): any {
    return value;
  }
}