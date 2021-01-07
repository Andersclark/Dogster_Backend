import { Module } from '@nestjs/common';
import { DogsController } from './dogs.controller';
import { DogsService } from './dogs.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { DogRepository } from "./dog.repository";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([DogRepository]),
    AuthModule,
  ],
  controllers: [DogsController],
  providers: [DogsService]
})
export class DogsModule {}
