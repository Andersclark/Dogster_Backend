import {Injectable, NotFoundException} from '@nestjs/common';
import { Dog } from "./dog.entity";
import { CreateDogDTO } from "./dto/create-dog.dto";
import { GetDogsFilterDTO } from "./dto/get-dogs-filter.dto";
import { DogRepository } from "./dog.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { IsNotEmpty } from "class-validator";
import { User } from "../auth/user.entity";

// ON FILTERS: Filters are pre-defined (for example a UI button with "Malmö") and should not have to be mutated before applying them to the data collection.
// ON SEARCH: Search params can be free text from the user and should be handled accordingly: toLowercase(), includes() etc.

@Injectable()
export class DogsService {
  constructor(
    @InjectRepository(DogRepository)
    private dogRepository: DogRepository,
  ) {}

  async getDogById(
    targetId: number,
    user: User
  ): Promise<Dog> {
    const found = await this.dogRepository.findOne({  where: { id: targetId, userId: user.id } });
    if (!found) {
      throw new NotFoundException(`Dog with id ${targetId} not found`);
    }
    return found;
  }

  async getDogs(
    filterDTO: GetDogsFilterDTO,
    user: User
  ): Promise<Dog[]> {
    return this.dogRepository.getDogs(filterDTO, user);
  }

  async createDog(createDogDTO: CreateDogDTO, user: User): Promise<Dog> {
    return this.dogRepository.createDog(createDogDTO, user);
  }

  async deleteDogById(
    targetId: number,
    user: User
    ): Promise<void> {
   const result = await this.dogRepository.delete({ id: targetId, userId: user.id })
    if (result.affected === 0) {
      throw new NotFoundException(`Dog with id ${targetId} not found`)
    } else {
    }
  }
 async updateDogCity(
    targetId: number,
    newCity: string,
    user: User
 ): Promise<Dog> {
    const dog = await this.getDogById(targetId, user);
    dog.city = newCity;
    await dog.save();
    return dog;
  }

}
