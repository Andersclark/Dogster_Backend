import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
    UsePipes,
    ValidationPipe
} from "@nestjs/common";
import { DogsService } from "./dogs.service";
import { CreateDogDTO } from "./dto/create-dog.dto";
import { Dog } from "./dog.entity";
import { GetDogsFilterDTO } from './dto/get-dogs-filter.dto';
import { DogCityValidationPipe } from "./pipes/dog-city-validation.pipe";

@Controller('dogs')
export class DogsController {

    constructor(private dogsService: DogsService) {  }

    @Get('/:id')
    getDogById(@Param('id', ParseIntPipe) id: number): Promise<Dog> {
        return this.dogsService.getDogById(id);
    }

    @Get()
    getDogs(@Query(ValidationPipe) filterDTO: GetDogsFilterDTO): Promise<Dog[]> {
        return this.dogsService.getDogs(filterDTO);
    }

    @Post()
    @UsePipes(ValidationPipe)
    createDog(
      @Body() createDogDTO: CreateDogDTO): Promise<Dog> {
        return this.dogsService.createDog(createDogDTO);
    }

    @Delete('/:id')
    deleteDogById(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.dogsService.deleteDogById(id);
    }

    @Patch('/:id/city')
    updateDogCity(
      @Param('id', ParseIntPipe) id: number,
      @Body('city', DogCityValidationPipe) city: string
    ): Promise<Dog> {
        return this.dogsService.updateDogCity(id, city)
    }
}
