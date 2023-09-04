import { Global, Module } from '@nestjs/common';
import { ThemoviedbService } from './themoviedb.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie } from '../movie/entities';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Movie])],
  providers: [ThemoviedbService],
  exports: [ThemoviedbService]
})
export class ThemoviedbModule {}
