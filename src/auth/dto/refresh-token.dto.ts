import { IsString } from "class-validator";

export class RefreshTokenDTO {
  @IsString()
  authToken: string;

  @IsString()
  refreshToken: string;
}