import { Module } from '@nestjs/common';
import { DogsModule } from './dogs/dogs.module';

@Module({
  imports: [DogsModule],
})
export class AppModule {}
