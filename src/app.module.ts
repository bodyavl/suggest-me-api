import { Module } from '@nestjs/common';
import { MovieModule } from './movie/movie.module';
import { AuthModule } from './auth/auth.module';
import { ThemoviedbModule } from './themoviedb/themoviedb.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatModule } from './stat/stat.module';
import { UserModule } from './user/user.module';
import { dataSourceOptions } from '../db/data-source';

@Module({
  imports: [
    MovieModule,
    AuthModule,
    ThemoviedbModule,
    ConfigModule.forRoot(
      { isGlobal: true },
    ),
    TypeOrmModule.forRoot(dataSourceOptions),
    StatModule,
    UserModule,
  ],
})
export class AppModule {}
