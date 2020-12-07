import { EntityRepository, Repository } from "typeorm";
import { Dog } from "./dog.entity";
import { CreateDogDTO } from "./dto/create-dog.dto";
import { GetDogsFilterDTO } from "./dto/get-dogs-filter.dto";

@EntityRepository(Dog)
export class DogRepository extends Repository<Dog> {

  async createDog(createDogDTO: CreateDogDTO): Promise<Dog> {
    const {  name, description, owner, city, area } = createDogDTO;
    const dog = new Dog();
    dog.name = name;
    dog.description = description;
    dog.owner = owner;
    dog.city = city;
    dog.area = area;
    await dog.save();

    return dog;
  }
  async getDogs(filterDTO: GetDogsFilterDTO): Promise<Dog[]> {
    const { city, owner, area, search } = filterDTO;
    const query = this.createQueryBuilder('dog');

    if (city) {
      query.andWhere('dog.city = :city', { city })
    }
    if (area) {
      query.andWhere('dog.area = :area', { area })
    }
    if ( search ) {
      query.andWhere('(dog.name LIKE :search OR dog.description LIKE :search OR dog.owner LIKE :search)', { search: `%${search}%` });
    }


    const dogs = await query.getMany();
    return dogs;
  }
}