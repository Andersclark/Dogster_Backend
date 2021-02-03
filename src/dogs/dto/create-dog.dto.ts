import { IsNotEmpty } from 'class-validator';

export class CreateDogDTO {
  @IsNotEmpty()
  name: string;
  description: string;
  @IsNotEmpty()
  owner: string;
  @IsNotEmpty()
  city: string;
  area: string;
}
