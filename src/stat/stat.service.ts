import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Stat } from './entities';
import { Repository } from 'typeorm';


@Injectable()
export class StatService {
  constructor(@InjectRepository(Stat) private statRepository: Repository<Stat>){}

  
  findOne(id: number) {
    return this.statRepository.findOneBy({id});
  }
}
