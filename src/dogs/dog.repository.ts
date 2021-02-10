import { EntityRepository, Repository } from 'typeorm';
import { InternalServerErrorException } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { Dog } from './dog.entity';
import { CreateDogDTO } from './dto/create-dog.dto';
import { GetDogsFilterDTO } from './dto/get-dogs-filter.dto';
import { User } from '../auth/user.entity';

@EntityRepository(Dog)
export class DogRepository extends Repository<Dog> {
  async createDog(createDogDTO: CreateDogDTO, user: User): Promise<Dog> {
    const { name, description, city, area } = createDogDTO;
    const dog = new Dog();
    dog.id = uuid();
    dog.name = name;
    dog.description = description;
    dog.owner = user;
    dog.city = city;
    dog.area = area;
    try {
      await dog.save();
    } catch (error) {
      throw new InternalServerErrorException('Failed to create dog');
    }

    delete dog.owner;
    return dog;
  }

  async getDogs(filterDTO: GetDogsFilterDTO, user: User): Promise<Dog[]> {
    const { city, area, search } = filterDTO;
    const query = this.createQueryBuilder('dog');
    if (user) {
      query.where('dog.owner = :user', { owner: user });
    }
    if (city) {
      query.andWhere('dog.city = :city', { city });
    }
    if (area) {
      query.andWhere('dog.area = :area', { area });
    }
    if (search) {
      query.andWhere(
        '(dog.name LIKE :search ' +
          'OR dog.description LIKE :search ' +
          'OR dog.owner LIKE :search ' +
          'OR dog.area LIKE :search)',
        { search: `%${search}%` },
      );
    }
    try {
      return await query.getMany();
    } catch (error) {
      throw new InternalServerErrorException('Failed to get dogs');
    }
  }
}
