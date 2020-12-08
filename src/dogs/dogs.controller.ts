import {
    Body,
    Controller,
    Delete,
    Get, Logger,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query, UseGuards,
    UsePipes,
    ValidationPipe
} from "@nestjs/common";
import { DogsService } from "./dogs.service";
import { CreateDogDTO } from "./dto/create-dog.dto";
import { Dog } from "./dog.entity";
import { GetDogsFilterDTO } from './dto/get-dogs-filter.dto';
import { DogCityValidationPipe } from "./pipes/dog-city-validation.pipe";
import { AuthGuard } from "@nestjs/passport";
import { User } from "../auth/user.entity";
import { GetUser } from "../auth/get-user.decorator";

@Controller('dogs')
@UseGuards(AuthGuard())
export class DogsController {
    private logger = new Logger('DogsController')
    constructor(private dogsService: DogsService) {  }

    @Get('/:id')
    getDogById(
      @Param('id', ParseIntPipe) id: number,
      @GetUser() user: User
    ): Promise<Dog> {
        this.logger.verbose(`User ${user.username} retrieving dog with ID ${id}`);
        return this.dogsService.getDogById(id, user);
    }

    @Get()
    getDogs(@Query(ValidationPipe) filterDTO: GetDogsFilterDTO,
            @GetUser() user: User
            ): Promise<Dog[]> {
        this.logger.verbose(`User ${user.username} retrieving all dogs. Filter: ${JSON.stringify(filterDTO)}`);
        return this.dogsService.getDogs(filterDTO, user);
    }

    @Post()
    @UsePipes(ValidationPipe)
    createDog(
      @Body() createDogDTO: CreateDogDTO,
      @GetUser() user: User,
      ): Promise<Dog> {
        this.logger.verbose(`User ${user.username} creating new Dog: ${JSON.stringify(createDogDTO)}`)
        return this.dogsService.createDog(createDogDTO, user);
    }

    @Delete('/:id')
    deleteDogById(
        @Param('id', ParseIntPipe
        ) id: number,
        @GetUser() user: User
    ): Promise<void> {
        this.logger.verbose(`User ${user.username} deleting dog with ID ${id}`);
        return this.dogsService.deleteDogById(id, user);
    }

    @Patch('/:id/city')
    updateDogCity(
      @Param('id', ParseIntPipe) id: number,
      @Body('city', DogCityValidationPipe) city: string,
        @GetUser() user: User
    ): Promise<Dog> {
        this.logger.verbose(`User ${user.username} updating city of dog with ID ${id}`);
        return this.dogsService.updateDogCity(id, city, user)
    }
}
