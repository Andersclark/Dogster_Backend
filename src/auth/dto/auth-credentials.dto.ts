import { IsString, MaxLength, MinLength } from 'class-validator';

export class AuthCredentialsDTO {
  @IsString()
  @MinLength(4, { message: 'username has to be longer than 4 characters' })
  @MaxLength(30, { message: 'username cannot be longer than 30 characters' })
  username: string;

  @IsString()
  @MinLength(12, { message: 'password too short (minimum 12 characters)' })
  @MaxLength(99, { message: 'password too long (maximum 99 characters)' })
  password: string;
}
