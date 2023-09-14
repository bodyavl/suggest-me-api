import { registerAs } from '@nestjs/config';
import { TmdbConfing } from './config.type';
import { IsString } from 'class-validator';
import validateConfig from '../utils/validate-config';

class EnvironmentVariablesValidator {
  @IsString()
  TMDB_API_KEY: string;
}

export default registerAs<TmdbConfing>('tmdb', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    api_key: process.env.TMDB_API_KEY,
  };
});
