import { Module } from '@nestjs/common';
import { MovieModule } from './movie/movie.module';
import { AuthModule } from './auth/auth.module';
import { ThemoviedbModule } from './themoviedb/themoviedb.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatModule } from './stat/stat.module';
import { UserModule } from './user/user.module';
import { dataSourceOptions } from '../db/data-source';
import authConfig from './config/auth.config';
import databaseConfig from './config/database.config';
import tmdbConfig from './config/tmdb.config';

@Module({
  imports: [
    MovieModule,
    AuthModule,
    ThemoviedbModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [authConfig, databaseConfig, tmdbConfig],
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    StatModule,
    UserModule,
  ],
})
export class AppModule {}
