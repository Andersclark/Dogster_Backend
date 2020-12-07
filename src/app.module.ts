import { Module } from '@nestjs/common';
import { DogsModule } from './dogs/dogs.module';
import { TypeOrmModule } from "@nestjs/typeorm";
import { typeOrmConfig } from "./config/typeorm.config";
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    DogsModule,
    AuthModule
  ],
})
export class AppModule {}
