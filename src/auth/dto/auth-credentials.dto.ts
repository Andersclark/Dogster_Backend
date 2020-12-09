import { IsString, Matches, MaxLength, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class AuthCredentialsDTO {
  @ApiProperty({ example: 'obamab', description: 'The username which the user wish to be identified with' })
  @IsString()
  @MinLength(4)
  @MaxLength(30)
  username: string;

  @ApiProperty({ example: 'strongPassword123!_', description: 'A password conforming to the rules of at least 8 characters, one uppercase, one lowercase and one special character or number' })
  @IsString()
  @MinLength(8)
  @MaxLength(99)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
    { message: 'password too weak'})
  password: string;
}