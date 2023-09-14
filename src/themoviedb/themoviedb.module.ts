import { Global, Module } from '@nestjs/common';
import { ThemoviedbService } from './themoviedb.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie } from '../movie/entities';

@Module({
  exports: [ThemoviedbService],
  imports: [TypeOrmModule.forFeature([Movie])],
  providers: [ThemoviedbService],
})
export class ThemoviedbModule {}
