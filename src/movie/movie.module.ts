import { Module } from '@nestjs/common';
import { MovieService } from './movie.service';
import { MovieController } from './movie.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie } from './entities';
import { AccessTokenStrategy } from '../auth/strategy';
import { Stat } from '../stat/entities';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Movie, Stat]), JwtModule.register({})],
  controllers: [MovieController],
  providers: [MovieService, AccessTokenStrategy],
})
export class MovieModule {}
