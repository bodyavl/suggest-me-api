import {
  Injectable,
  NotFoundException,
  OnApplicationBootstrap,
  OnModuleInit,
} from '@nestjs/common';
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

  async findAll() {
    const randomMovies = this.moviesRepository
      .createQueryBuilder('movie')
      .select([
        'movie.id',
        'movie.title',
        'movie.poster',
        'movie.genres',
        'movie.type',
        'movie.rating',
      ])
      .orderBy('RANDOM()')
      .take(8)
      .getMany();
    return await randomMovies;
  }

  async findOne(id: number) {
    const movie = await this.moviesRepository.findOneBy({
      id,
    });
    if (!movie) throw new NotFoundException();
    return movie;
  }

  onModuleInit() {
    this.themoviedb.runBackgroundFetching(this.moviesRepository);
  }
}
