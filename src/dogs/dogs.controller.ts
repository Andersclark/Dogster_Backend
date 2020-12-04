import {Body, Controller, Delete, Get, Param, Patch, Post, Query, UsePipes, ValidationPipe} from '@nestjs/common';
import { DogsService } from "./dogs.service";
import { CreateDogDTO } from "./dto/create-dog.dto";
import { Dog } from "./dog.model";
import { GetDogsFilterDTO } from "./dto/get-dogs-filter.dto";

@Controller('dogs')
export class DogsController {

    constructor(private dogsService: DogsService) {  }

    @Get()
    getDogs(@Query() filterDTO: GetDogsFilterDTO): Dog[] {
        if(Object.keys(filterDTO).length) {
            return this.dogsService.getDogsWithFilters(filterDTO)
        } else {
            return this.dogsService.getAllDogs();
        }
    }

    @Get('/:id')
    getDogById(@Param('id') id: string): Dog {
        return this.dogsService.getDogById(id);
    }

    @Post()
    @UsePipes(ValidationPipe)
    createDog(
        @Body() createDogDTO: CreateDogDTO): Dog {
        return this.dogsService.createDog(createDogDTO);
    }

    @Delete('/:id')
    deleteDogById(@Param('id') id: string): void {
        this.dogsService.deleteDogById(id);
    }

    @Patch('/:id/city')
    updateDogHome(@Body('city') city: string, @Param('id') id: string): Dog {
        return this.dogsService.updateDogHome(city, id)
    }
}
