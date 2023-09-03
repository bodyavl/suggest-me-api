import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class ThemoviedbService {
//   async addMoviesToDb(pageIteration = 1, iterationCount: number) {
//     if (pageIteration > 20000) return;
//     for (let i = 1; i < pageIteration + iterationCount; i++) {
//       const movieRes = await axios.get(
//         'https://api.themoviedb.org/3/discover/movie',
//         {
//           params: {
//             api_key: process.env.TMDB_API_KEY,
//             with_genres: '28|27|18|35',
//             page: i,
//           },
//         },
//       );
//       let movieIds = [];
//       movieRes.data.results.forEach((element) => {
//         movieIds.push(element.id);
//       });
//       for (let movieId of movieIds) {
//         try {
//           const response = await axios.get(
//             `https://api.themoviedb.org/3/movie/${movieId}`,
//             {
//               params: {
//                 api_key: process.env.TMDB_API_KEY,
//               },
//             },
//           );
//           const {
//             id,
//             title,
//             poster_path,
//             backdrop_path,
//             vote_average,
//             genres,
//             runtime,
//             tagline,
//             overview,
//             release_date,
//           } = response.data;
//           if (overview) {
//             const newMovie = await Movie.create({
//               id: `${id}m`,
//               title,
//               type: 'Movie',
//               tagline,
//               description: overview,
//               poster: `https://image.tmdb.org/t/p/original${poster_path}`,
//               backdrop: `https://image.tmdb.org/t/p/original${backdrop_path}`,
//               rating: vote_average,
//               runtime,
//               genres,
//               date: release_date,
//             });
//           }
//         } catch (error) {
//           if (error.code !== 11000) console.log(JSON.stringify(error));
//         }
//       }
//       const tvRes = await axios.get(
//         'https://api.themoviedb.org/3/discover/tv',
//         {
//           params: {
//             api_key: process.env.TMDB_API_KEY,
//             with_genres: '28|27|18|35',
//             page: i,
//           },
//         },
//       );
//       let tvIds = [];
//       tvRes.data.results.forEach((element) => {
//         tvIds.push(element.id);
//       });
//       for (let tvId of tvIds) {
//         try {
//           const response = await axios.get(
//             `https://api.themoviedb.org/3/tv/${tvId}`,
//             {
//               params: {
//                 api_key: process.env.TMDB_API_KEY,
//               },
//             },
//           );
//           const {
//             id,
//             name,
//             poster_path,
//             backdrop_path,
//             vote_average,
//             genres,
//             runtime,
//             tagline,
//             overview,
//             release_date,
//           } = response.data;
//           if (overview) {
//             const newTV = await Movie.create({
//               id: `${id}tv`,
//               title: name,
//               type: 'TV show',
//               tagline,
//               description: overview,
//               poster: `https://image.tmdb.org/t/p/original${poster_path}`,
//               backdrop: `https://image.tmdb.org/t/p/original${backdrop_path}`,
//               rating: vote_average,
//               runtime,
//               genres,
//               date: release_date,
//             });
//           }
//         } catch (error) {
//           if (error.code !== 11000) console.log(JSON.stringify(error));
//         }
//       }
//     }
//   }
}
