import { Test } from '@nestjs/testing';
import { DogsService } from "./dogs.service";
import { DogRepository } from "./dog.repository";
import { GetDogsFilterDTO } from "./dto/get-dogs-filter.dto";

const mockuser = { username: 'TestUser', }
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
      const result = await dogsService.getDogs(filters, mockuser);

      expect(dogRepository.getDogs).toHaveBeenCalled();
      expect(result).toEqual('someValue');
    })
  });
  describe('getDogById', async () => {
    dogRepository.findOne.mockReturnValue({id: 1, name: 'name', description: 'description', city: 'city', area: 'area'})
  })
});