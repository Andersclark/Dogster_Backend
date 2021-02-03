import { IsNotEmpty, IsOptional } from 'class-validator';

export class GetDogsFilterDTO {
  @IsOptional()
  @IsNotEmpty()
  city: string;

  @IsOptional()
  @IsNotEmpty()
  area: string;

  @IsOptional()
  @IsNotEmpty()
  search: string;

  @IsOptional()
  @IsNotEmpty()
  owner: string;
}
