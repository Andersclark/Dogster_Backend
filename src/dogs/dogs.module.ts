import { Module } from '@nestjs/common';
import { DogsController } from './dogs.controller';
import { DogsService } from './dogs.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { DogRepository } from "./dog.repository";

@Module({
  imports: [
    TypeOrmModule.forFeature([DogRepository]),
  ],
  controllers: [DogsController],
  providers: [DogsService]
})
export class DogsModule {}
