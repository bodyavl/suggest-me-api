import {
  Injectable,
  NotFoundException,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from './entities';
import { ThemoviedbService } from '../themoviedb/themoviedb.service';
import { FindMoviesQueryDto } from './dto';
import { StatService } from '../stat/stat.service';

@Injectable()
export class MovieService implements OnModuleInit {
  constructor(
    @InjectRepository(Movie) private movieRepository: Repository<Movie>,
    private statService: StatService,
    private themoviedb: ThemoviedbService,
  ) {}

  async findAll(userId: number, dto: FindMoviesQueryDto) {
    const randomMovies = await this.getMovies(dto.genre);
    if (!userId) return randomMovies;
    await this.updateStats(userId, randomMovies, dto.manual);
    return randomMovies;
  }

  async getMovies(genre: string): Promise<Movie[]> {
    const where = genre && genre !== 'Any' ? 'movie.genres @> :genres' : '';
    const randomMovies = await this.movieRepository
      .createQueryBuilder('movie')
      .where(where, { genres: [genre] })
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
    const stat = await this.statService.findOneBy({
      user: { id: userId },
    });
    if (!stat) throw new UnauthorizedException();

    let { movies, tv_shows, suggestions, man_suggestions } = stat;

    for (let movie of randomMovies) {
      if (movie.type === 'Movie') movies++;
      if (movie.type === 'TV show') tv_shows++;
    }
    if (isManual) man_suggestions++;
    else suggestions++;

    const newStats = await this.statService.update(
      {
        user: { id: userId },
      },
      {
        movies,
        tv_shows,
        suggestions,
        man_suggestions,
      },
    );
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
