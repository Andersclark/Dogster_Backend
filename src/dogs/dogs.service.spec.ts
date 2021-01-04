import { Test } from '@nestjs/testing';
import { DogsService } from "./dogs.service";
import { DogRepository } from "./dog.repository";
import { GetDogsFilterDTO } from "./dto/get-dogs-filter.dto";
import { NotFoundException } from "@nestjs/common";

const mockUser = { id: 12, username: 'TestUser', }
const mockDog = {
  id: 1,
  name: "name",
  description: "description",
  city: "city",
  area: "area"
};
const mockDogRepository = () => ({
  // method will be mocked by Jest and calls can later be evaluated.
  getDogs: jest.fn(),
  findOne: jest.fn(),

});

describe('Dogsservice', () => {
  let dogsService;
  let dogRepository;

  beforeEach( async() => {
    // For each test we will create a new module
    const module = await Test.createTestingModule({
      providers: [
        DogsService,
        // DogRepository will be replaced with the mockDogRepo
        { provide: DogRepository, useFactory: mockDogRepository},
      ],
    }).compile();

    dogsService = await module.get<DogsService>(DogsService);
    dogRepository = await module.get<DogRepository>(DogRepository);
  });
  describe('getDogs', () => {
    it('gets all dogs from repository', async () => {
      dogRepository.getDogs.mockReturnValue('someValue') ;
      expect(dogRepository.getDogs).not.toHaveBeenCalled();
      const filters: GetDogsFilterDTO = {city: 'City', area: 'Area', owner: 'Owner', search: ''};
      const result = await dogsService.getDogs(filters, mockUser);

      expect(dogRepository.getDogs).toHaveBeenCalled();
      expect(result).toEqual('someValue');
    })
  });
  describe('getDogById', () => {
    it('call dogRepository.findOne() and successfully retrieve and return the dog',async () => {
      dogRepository.findOne.mockReturnValue(mockDog);
      const result = await dogsService.getDogById(1, mockUser);
      expect(result).toEqual(mockDog);
      expect(dogRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: 1,
          userId: mockUser.id
      }})
    });
    it('throws an error when task is not found', () => {
      dogRepository.findOne.mockResolvedValue(null);
      expect(dogsService.getDogById(1, mockUser)).rejects.toThrow(NotFoundException);
    })
  });
});