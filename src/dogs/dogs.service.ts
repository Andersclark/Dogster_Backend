import {Injectable, NotFoundException} from '@nestjs/common';
import { Dog } from "./dog.model";
import { v1 as uuid} from 'uuid';
import { CreateDogDTO } from "./dto/create-dog.dto";
import {GetDogsFilterDTO} from "./dto/get-dogs-filter.dto";

// ON FILTERS: Filters are pre-defined (for example a UI button with "Malmö") and should not have to be mutated before applying them to the data collection.
// ON SEARCH: Search params can be free text from the user and should be handled accordingly: toLowercase(), includes() etc.

@Injectable()
export class DogsService {
    // TODO: Remove dummy data
    private dogs: Dog[] = [
        {
        "id": "f2518120-360b-11eb-9729-3b31ae298e9e",
        "name": "Saga",
        "description": "Querky as hell. Can wrestle and run but not so good with small dogs.",
        "owner": "Johan",
        "city": "Malmö",
        "area": "Värnhem"
        },
        {
            "id": "f487c210-360b-11eb-9729-3b31ae298e9e",
            "name": "Lovis",
            "description": "Querky as hell. Can wrestle and run but not so good with small dogs.",
            "owner": "A friendly young couple",
            "city": "Malmö",
            "area": "Värnhem"
        },
        {
            "id": "f9675110-360b-11eb-9729-3b31ae298e9e",
            "name": "Indy",
            "description": "Querky as hell. Can wrestle and run but not so good with small dogs.",
            "owner": "Anders",
            "city": "Malmö",
            "area": "Celsiusgatan"
        },
        {
            "id": "6ae8a0f0-360c-11eb-bfe0-631008fd1ff6",
            "name": "Tyson",
            "description": "Looks like a toad, acts like a toad.",
            "owner": "Young tall dude and short blonde girl.",
            "city": "Malmö",
            "area": "Ellstorp"
        }
    ];

    getAllDogs(): Dog[] {
        return this.dogs;
    }

    getDogsWithFilters(filterDTO: GetDogsFilterDTO): Dog[] {
        const { city, search } = filterDTO;
        let dogs = this.getAllDogs();
        if (city) {
            dogs = dogs.filter(dog => dog.city === city);
        }

        if (search) {
            console.log(search)
            dogs = dogs.filter(dog =>
                dog.name.includes(search) ||
                dog.description.includes(search)
            );
        }
        return dogs;
    }
    getDogById(targetId: string): Dog {
        const foundDog = this.dogs.find(dog => dog.id === targetId);
        if(!foundDog){
            throw new NotFoundException(`Dog with id ${targetId} not found`);
        }
        return foundDog;
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
    updateDogHome(newCity: string, targetId): Dog {
        let dog = this.getDogById(targetId);
        dog.city = newCity;
        return dog;
    }
}
