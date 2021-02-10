import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Dog } from './dog.entity';
import { CreateDogDTO } from './dto/create-dog.dto';
import { GetDogsFilterDTO } from './dto/get-dogs-filter.dto';
import { DogRepository } from './dog.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../auth/user.entity';

// ON FILTERS: Filters are pre-defined (for example a UI button with "Malmö") and should not have to be mutated before applying them to the data collection.
// ON SEARCH: Search params can be free text from the user and should be handled accordingly: toLowercase(), includes() etc.

@Injectable()
export class DogsService {
  constructor(
    @InjectRepository(DogRepository)
    private dogRepository: DogRepository,
  ) {}

  async getDogById(targetId: string): Promise<Dog> {
    const found = await this.dogRepository.findOne({ where: { id: targetId } });
    if (!found) {
      throw new NotFoundException(`Dog with id ${targetId} not found`);
    }
    return found;
  }

  async getDogs(filterDTO: GetDogsFilterDTO, user: User): Promise<Dog[]> {
    return await this.dogRepository.getDogs(filterDTO, user);
  }

  async createDog(createDogDTO: CreateDogDTO, user: User): Promise<Dog> {
    return await this.dogRepository.createDog(createDogDTO, user);
  }

  async deleteDogById(targetId: string, user: User): Promise<void> {
    const result = await this.dogRepository.delete({ id: targetId, owner: user });

    if (result.affected === 0) {
      throw new NotFoundException(`Dog with id ${targetId} not found`);
    }
  }

  // TODO: This needs to validate that user is owner of dog
  async updateDog(newDog: Dog, user: User): Promise<Dog> {
    const dog = await this.getDogById(newDog.id);
    if (user.dogs.find(userDog => userDog === dog)) {
      Object.keys(dog).forEach(key => (dog[key] = newDog[key]));
      try {
        return await dog.save();
      } catch (e) {
        throw InternalServerErrorException;
      }
    }
  }
}
