import { EntityRepository, Repository } from "typeorm";
import { Dog } from "./dog.entity";
import { CreateDogDTO } from "./dto/create-dog.dto";
import { GetDogsFilterDTO } from "./dto/get-dogs-filter.dto";
import { User } from "../auth/user.entity";

@EntityRepository(Dog)
export class DogRepository extends Repository<Dog> {

  async createDog(createDogDTO: CreateDogDTO, user: User): Promise<Dog> {
    const {  name, description, city, area } = createDogDTO;
    const dog = new Dog();
    dog.name = name;
    dog.description = description;
    dog.owner = user;
    dog.city = city;
    dog.area = area;
    dog.userId = user.id;
    await dog.save();

    delete dog.owner;

    return dog;
  }
  async getDogs(
    filterDTO: GetDogsFilterDTO,
    user: User
  ): Promise<Dog[]> {
    const { city, area, search } = filterDTO;
    const query = this.createQueryBuilder('dog');
    if(user) {
      query.where('dog.userId = :userId', { userId: user.id });
    }
    if (city) {
      query.andWhere('dog.city = :city', { city })
    }
    if (area) {
      query.andWhere('dog.area = :area', { area })
    }
    if ( search ) {
      query.andWhere('(dog.name LIKE :search OR dog.description LIKE :search OR dog.owner LIKE :search)', { search: `%${search}%` });
    }
    return await query.getMany();
  }
}