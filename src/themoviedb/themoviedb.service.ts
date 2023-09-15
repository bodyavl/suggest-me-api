import { Injectable } from '@nestjs/common';
import { Movie } from '../movie/entities';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from '../config/config.type';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

@Injectable()
export class ThemoviedbService {
  constructor(
    private configService: ConfigService<AllConfigType>,
    private readonly httpService: HttpService,
  ) {
    this.addMoviesToDb = this.addMoviesToDb.bind(this);
  }

  async runBackgroundFetching(movieRepository: Repository<Movie>) {
    const FETCHINGDELAY = this.configService.getOrThrow('tmdb.delay', {
      infer: true,
    });
    const iterationCount = this.configService.getOrThrow(
      'tmdb.iterationCount',
      {
        infer: true,
      },
    );
    const api_key = this.configService.getOrThrow('tmdb.apiKey', {
      infer: true,
    });

    setTimeout(
      this.addMoviesToDb,
      FETCHINGDELAY,
      1,
      movieRepository,
      FETCHINGDELAY,
      iterationCount,
      api_key,
    );
  }

  async addMoviesToDb(
    pageIteration = 1,
    movieRepository: Repository<Movie>,
    FETCHINGDELAY: number,
    iterationCount: number,
    api_key: string,
  ) {
    if (pageIteration > 500) return;
    for (let i = 1; i < pageIteration + iterationCount; i++) {
      const movieRes = await firstValueFrom(
        this.httpService
          .get<any>('/discover/movie', {
            params: {
              api_key,
              with_genres: '28|27|18|35',
              page: i,
            },
          })
          .pipe(
            catchError((error: AxiosError) => {
              console.log(error.response.data);
              throw 'axios error occured';
            }),
          ),
      );

      let movieIds = [];
      for (let movie of movieRes.data.results) {
        movieIds.push(movie.id);
      }

      for (let movieId of movieIds) {
        try {
          const { data } = await firstValueFrom(
            this.httpService.get(`/movie/${movieId}`, {
              params: {
                api_key,
              },
            }),
          );

          const {
            id,
            title,
            poster_path,
            backdrop_path,
            vote_average,
            genres,
            runtime,
            tagline,
            overview,
            release_date,
          } = data;

          const genresArray = genres.map((genre) => genre.name);

          if (overview) {
            const newMovie = movieRepository.create({
              id,
              title,
              type: 'Movie',
              tagline,
              description: overview,
              poster: `https://image.tmdb.org/t/p/original${poster_path}`,
              backdrop: `https://image.tmdb.org/t/p/original${backdrop_path}`,
              rating: vote_average,
              runtime,
              genres: genresArray,
              date: release_date,
            });

            await movieRepository.save(newMovie);
          }
        } catch (error) {
          if (error.code !== '23502') {
          }
        }
      }

      const tvRes = await firstValueFrom(
        this.httpService
          .get('/discover/tv', {
            params: {
              api_key,
              with_genres: '28|27|18|35',
              page: i,
            },
          })
          .pipe(
            catchError((error: AxiosError) => {
              console.log(error.response.data);
              throw 'axios error occured';
            }),
          ),
      );

      let tvIds = [];
      for (let tv of tvRes.data.results) {
        tvIds.push(tv.id);
      }

      for (let tvId of tvIds) {
        try {
          const { data } = await firstValueFrom(
            this.httpService
              .get(`/tv/${tvId}`, {
                params: {
                  api_key,
                },
              })
              .pipe(
                catchError((error: AxiosError) => {
                  console.log(error.response.data);
                  throw 'axios error occured';
                }),
              ),
          );
          const {
            id,
            name,
            poster_path,
            backdrop_path,
            vote_average,
            genres,
            runtime,
            tagline,
            overview,
            release_date,
          } = data;

          const genresArray = genres.map((genre) => genre.name);

          if (overview) {
            const newTV = movieRepository.create({
              id,
              title: name,
              type: 'TV show',
              tagline,
              description: overview,
              poster: `https://image.tmdb.org/t/p/original${poster_path}`,
              backdrop: `https://image.tmdb.org/t/p/original${backdrop_path}`,
              rating: vote_average,
              runtime,
              genres: genresArray,
              date: release_date,
            });
            await movieRepository.save(newTV);
          }
        } catch (error) {
          if (error.code !== '23502') {
          }
        }
      }
    }

    setTimeout(
      this.addMoviesToDb,
      FETCHINGDELAY,
      pageIteration + iterationCount,
      movieRepository,
      FETCHINGDELAY,
      iterationCount,
      api_key,
    );
  }
}
