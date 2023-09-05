import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from './entities';
import { ThemoviedbService } from '../themoviedb/themoviedb.service';
import { Stat } from '../stat/entities';

@Injectable()
export class MovieService implements OnModuleInit {
  constructor(
    @InjectRepository(Movie) private movieRepository: Repository<Movie>,
    @InjectRepository(Stat) private statRepository: Repository<Stat>,
    private themoviedb: ThemoviedbService,
  ) {}

  async findAll() {
    const randomMovies = await this.movieRepository
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
    return randomMovies;
  }

  async updateStats(
    userId: number,
    randomMovies: Movie[],
    isManual: boolean = false,
  ) {

    const stat = await this.statRepository.findOneBy({
      user: {id: userId}
    })

    let {movies, tv_shows, suggestions, man_suggestions} = stat;

    for (let movie of randomMovies) {
      if (movie.type === 'Movie') movies++;
      if (movie.type === 'TV Show') tv_shows++;
    }
    if (isManual) man_suggestions++;
    else suggestions++;

    const newStats = await this.statRepository.update({
      user: {id: userId}
    }, {
      movies, tv_shows, suggestions, man_suggestions
    })
    return newStats;
  }

  async findOne(id: number): Promise<Movie> {
    const movie = await this.movieRepository.findOneBy({
      id,
    });
    if (!movie) throw new NotFoundException();
    return movie;
  }

  onModuleInit() {
    this.themoviedb.runBackgroundFetching(this.movieRepository);
  }
}
