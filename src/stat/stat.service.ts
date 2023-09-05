import { Injectable } from '@nestjs/common';
import { CreateStatDto } from './dto/create-stat.dto';
import { UpdateStatDto } from './dto/update-stat.dto';

@Injectable()
export class StatService {

  findOne(id: number) {
    return `This action returns a #${id} stat`;
  }
}
