import { PipeTransform } from "@nestjs/common";

export class DogCityValidationPipe implements PipeTransform {
  transform(value: any ): any {
    //TODO: Validate through map API.
    return value.toString();
  }
}