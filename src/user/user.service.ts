import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Stat } from '../stat/entities';
import { Repository } from 'typeorm';


@Injectable()
export class UserService {
    constructor(@InjectRepository(Stat) private statRepository: Repository<Stat>){}
    async getStats(userId: number) {
        const stat = await this.statRepository.findOneBy({
            user: {id: userId}
        })
        return stat
    }
}
