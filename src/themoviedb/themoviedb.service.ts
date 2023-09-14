import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { Movie } from '../movie/entities';
import { Repository } from 'typeorm';

@Injectable()
export class ThemoviedbService {
  constructor() {}

  async runBackgroundFetching(movieRepository: Repository<Movie>) {
    const FETCHINGDELAY = 5000;
    const iterationCount = 50;

    setTimeout(addMoviesToDb, FETCHINGDELAY, 1);

    async function addMoviesToDb(pageIteration = 1) {
      if (pageIteration > 500) return;
      for (let i = 1; i < pageIteration + iterationCount; i++) {
        const movieRes = await axios.get(
          'https://api.themoviedb.org/3/discover/movie',
          {
            params: {
              api_key: process.env.TMDB_API_KEY,
              with_genres: '28|27|18|35',
              page: i,
            },
          },
        );
        let movieIds = [];
        for (let movie of movieRes.data.results) {
          movieIds.push(movie.id);
        }
        for (let movieId of movieIds) {
          try {
            const response = await axios.get(
              `https://api.themoviedb.org/3/movie/${movieId}`,
              {
                params: {
                  api_key: process.env.TMDB_API_KEY,
                },
              },
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
            } = response.data;
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
        const tvRes = await axios.get(
          'https://api.themoviedb.org/3/discover/tv',
          {
            params: {
              api_key: process.env.TMDB_API_KEY,
              with_genres: '28|27|18|35',
              page: i,
            },
          },
        );
        let tvIds = [];
        for (let tv of tvRes.data.results) {
          tvIds.push(tv.id);
        }
        for (let tvId of tvIds) {
          try {
            const response = await axios.get(
              `https://api.themoviedb.org/3/tv/${tvId}`,
              {
                params: {
                  api_key: process.env.TMDB_API_KEY,
                },
              },
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
            } = response.data;
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
      setTimeout(addMoviesToDb, FETCHINGDELAY, pageIteration + iterationCount);
    }
  }
}
