import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { DogsService } from './dogs.service';
import { CreateDogDTO } from './dto/create-dog.dto';
import { Dog } from './dog.entity';
import { GetDogsFilterDTO } from './dto/get-dogs-filter.dto';
import { DogValidationPipe } from './pipes/dog-validation.pipe';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../auth/user.entity';
import { GetUser } from '../auth/get-user.decorator';

@Controller('dogs')
@UseGuards(AuthGuard())
export class DogsController {
  constructor(private dogsService: DogsService) {}

  @Get('/:id')
  getDogById(@Param('id') id: string, @GetUser() user: User): Promise<Dog> {
    return this.dogsService.getDogById(id, user);
  }

  @Get()
  getDogs(
    @Query(ValidationPipe) filterDTO: GetDogsFilterDTO,
    @GetUser() user: User,
  ): Promise<Dog[]> {
    return this.dogsService.getDogs(filterDTO, user);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createDog(@Body() createDogDTO: CreateDogDTO, @GetUser() user: User): Promise<Dog> {
    return this.dogsService.createDog(createDogDTO, user);
  }

  @Delete('/:id')
  deleteDogById(@Param('id') id: string, @GetUser() user: User): Promise<void> {
    return this.dogsService.deleteDogById(id, user);
  }

  @Patch('/')
  @UsePipes(ValidationPipe)
  updateDog(@Body(DogValidationPipe) dog: Dog, @GetUser() user: User): Promise<Dog> {
    return this.dogsService.updateDog(dog, user);
  }
}
