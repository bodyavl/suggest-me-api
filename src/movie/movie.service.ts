import { Injectable, OnApplicationBootstrap, OnModuleInit } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from './entities';
import { ThemoviedbService } from '../themoviedb/themoviedb.service';

@Injectable()
export class MovieService implements OnModuleInit {
  constructor(
    @InjectRepository(Movie) private moviesRepository: Repository<Movie>,
    private themoviedb: ThemoviedbService,
  ) {}
  create(createMovieDto: CreateMovieDto) {
    return 'This action adds a new movie';
  }

  async findAll() {
    const randomMovies = this.moviesRepository
      .createQueryBuilder('movie')
      .select(['movie.id', 'movie.title', 'movie.poster', 'movie.genres', 'movie.type', 'movie.rating'])
      .orderBy('RANDOM()')
      .take(8)
      .getMany();
    return await randomMovies;
  }

  
  findOne(id: number) {
    return this.moviesRepository.findOneBy({
      id,
    });
  }

  update(id: number, updateMovieDto: UpdateMovieDto) {
    return `This action updates a #${id} movie`;
  }

  remove(id: number) {
    return `This action removes a #${id} movie`;
  }

  onModuleInit() {
    this.themoviedb.runBackgroundFetching(this.moviesRepository);
  }
}
