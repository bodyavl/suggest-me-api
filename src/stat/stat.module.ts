import { Module } from '@nestjs/common';
import { StatService } from './stat.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Stat } from './entities';

@Module({
  exports: [StatService],
  imports: [TypeOrmModule.forFeature([Stat])],
  providers: [StatService],
})
export class StatModule {}
