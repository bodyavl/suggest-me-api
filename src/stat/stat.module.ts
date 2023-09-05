import { Module } from '@nestjs/common';
import { StatService } from './stat.service';
import { StatController } from './stat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Stat } from './entities';
import { AccessTokenStrategy } from '../auth/strategy';

@Module({
  imports: [TypeOrmModule.forFeature([Stat])],
  controllers: [StatController],
  providers: [StatService, AccessTokenStrategy],
})
export class StatModule {}
