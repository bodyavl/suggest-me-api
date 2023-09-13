import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Stat } from './entities';
import { DeepPartial, FindOptionsWhere, Repository } from 'typeorm';

@Injectable()
export class StatService {
  constructor(
    @InjectRepository(Stat) private statRepository: Repository<Stat>,
  ) {}
  async create(stat: DeepPartial<Stat>) {
    const newStat = this.statRepository.create(stat);
    return this.statRepository.save(newStat);
  }

  async findOneBy(options: FindOptionsWhere<Stat>) {
    const stat = await this.statRepository.findOneBy(options);
    return stat;
  }
}
