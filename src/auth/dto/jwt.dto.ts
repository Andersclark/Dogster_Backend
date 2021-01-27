import { IsString } from "class-validator";

export class JwtDto {
  @IsString()
  authToken: string;

  @IsString()
  refreshToken: string;
}