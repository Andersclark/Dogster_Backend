import {Body, Controller, Delete, Get, Param, Post, Put} from '@nestjs/common';
import { DogsService } from "./dogs.service";
import { CreateDogDTO } from "./dto/create-dog.dto";
import { Dog } from "./dog.model";

@Controller('dogs')
export class DogsController {
    constructor(private dogsService: DogsService) {  }
    @Get()
    getAllDogs() {
        return this.dogsService.getAllDogs();
    }
    @Get('/:id')
    getDogById(@Param('id') id: string): Dog {
        return this.dogsService.getDogById(id);
    }
    @Post()
    createDog(
        @Body() createDogDTO: CreateDogDTO): Dog {
        return this.dogsService.createDog(createDogDTO);
    }
    @Delete('/:id')
    deleteDogById(@Param('id') id: string): void {
        this.dogsService.deleteDogById(id);
    }
    @Put('/:id')
    updateDogById(@Body() updatedDog: Dog, @Param('id') id: string): Dog {
        return this.dogsService.updateDogById(updatedDog, id)
    }
}
