import { registerAs } from '@nestjs/config';
import { TmdbConfing } from './config.type';
import { IsInt, IsString } from 'class-validator';
import validateConfig from '../utils/validate-config';

class EnvironmentVariablesValidator {
  @IsString()
  TMDB_API_KEY: string;

  @IsInt()
  FETCHING_DELAY: number;

  @IsInt()
  ITERATION_COUNT: number;
}

export default registerAs<TmdbConfing>('tmdb', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    apiKey: process.env.TMDB_API_KEY,
    delay: parseInt(process.env.FETCHING_DELAY),
    iterationCount: parseInt(process.env.ITERATION_COUNT),
  };
});
