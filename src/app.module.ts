import { Module } from '@nestjs/common';
import { DogsModule } from './dogs/dogs.module';
import { TypeOrmModule } from "@nestjs/typeorm";
import { typeOrmConfig } from "./config/typeorm.config";

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    DogsModule
  ],
})
export class AppModule {}
