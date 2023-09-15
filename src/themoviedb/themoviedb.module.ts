import { Module } from '@nestjs/common';
import { ThemoviedbService } from './themoviedb.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie } from '../movie/entities';
import { HttpModule } from '@nestjs/axios';

@Module({
  exports: [ThemoviedbService],
  imports: [
    TypeOrmModule.forFeature([Movie]),
    HttpModule.register({
      baseURL: 'https://api.themoviedb.org/3',
    }),
  ],
  providers: [ThemoviedbService],
})
export class ThemoviedbModule {}
