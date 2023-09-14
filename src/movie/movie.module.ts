import { Module } from '@nestjs/common';
import { MovieService } from './movie.service';
import { MovieController } from './movie.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie } from './entities';
import { AccessTokenStrategy } from '../auth/strategy';
import { JwtModule } from '@nestjs/jwt';
import { ThemoviedbModule } from '../themoviedb/themoviedb.module';
import { StatModule } from '../stat/stat.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Movie]),
    JwtModule.register({}),
    ThemoviedbModule,
    StatModule,
  ],
  controllers: [MovieController],
  providers: [MovieService, AccessTokenStrategy],
})
export class MovieModule {}
