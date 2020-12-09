import  { IsNotEmpty } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class CreateDogDTO {

    @ApiProperty({ example: 'Donald', description: 'The name of the dog' })
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: 'Red-blonde mut that likes to play dirty and doesn\'t know when to quit', description: 'A short string of ' })
    description: string;

    @ApiProperty({ example: 'Obama', description: 'The public name of the dogs owner' })
    @IsNotEmpty()
    owner: string;

    @ApiProperty({ example: 'Malmö', description: 'The city where the dog lives' })
    @IsNotEmpty()
    city: string;

    @ApiProperty({ example: 'Värnhem', description: 'The area of the city where the dog lives' })
    area: string;
}