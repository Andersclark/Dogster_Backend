import { Injectable } from '@nestjs/common';
import { Dog } from "./dog.model";
import { v1 as uuid} from 'uuid';
import { CreateDogDTO } from "./dto/create-dog.dto";

@Injectable()
export class DogsService {
    private dogs: Dog[] = [];

    getAllDogs(): Dog[] {
        return this.dogs;
    }
    getDogById(targetId: string): Dog {
        return this.dogs.find(dog => dog.id === targetId);
    }
    createDog(createDogDTO: CreateDogDTO): Dog {
        const dog: Dog = {
            id: uuid(),
        ...createDogDTO
        }
        this.dogs.push(dog);
        return dog;
    }
    deleteDogById(targetId: string): void {
        this.dogs.splice(this.dogs.findIndex(dog => dog.id === targetId), 1);
    }
    updateDogById(updatedDog: Dog, targetId): Dog {
        let dog = this.getDogById(targetId);
        dog = Object.assign(dog, updatedDog);
        return dog;
    }
}
