import { registerAs } from '@nestjs/config';
import { DatabaseConfig } from './config.type';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import validateConfig from '../utils/validate-config';

class EnvironmentVariablesValidator {
  @IsString()
  POSTGRES_HOST: string;

  @IsInt()
  @Min(0)
  @Max(65535)
  @IsOptional()
  POSTGRES_PORT: number;

  @IsString()
  POSTGRES_PASSWORD: string;

  @IsString()
  POSTGRES_DATABASE: string;

  @IsString()
  POSTGRES_USER: string;
}

export default registerAs<DatabaseConfig>('database', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT
      ? parseInt(process.env.POSTGRES_PORT, 10)
      : 5432,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
    username: process.env.POSTGRES_USER,
  };
});
