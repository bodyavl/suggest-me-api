import { registerAs } from '@nestjs/config';
import { AuthConfing } from './config.type';
import { IsString } from 'class-validator';
import validateConfig from '../utils/validate-config';

class EnvironmentVariablesValidator {
  @IsString()
  ACCESS_JWT_SECRET: string;

  @IsString()
  ACCESS_JWT_EXPIRES_IN: string;

  @IsString()
  REFRESH_JWT_SECRET: string;

  @IsString()
  REFRESH_JWT_EXPIRES_IN: string;
}

export default registerAs<AuthConfing>('auth', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    secret: process.env.ACCESS_JWT_SECRET,
    expires: process.env.ACCESS_JWT_EXPIRES_IN,
    refreshSecret: process.env.REFRESH_JWT_SECRET,
    refreshExpires: process.env.REFRESH_JWT_EXPIRES_IN,
  };
});
