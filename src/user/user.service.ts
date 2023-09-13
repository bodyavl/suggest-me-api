import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Stat } from '../stat/entities';
import {
  DeepPartial,
  FindOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { User } from './entities';
import { StatService } from '../stat/stat.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private statService: StatService,
  ) {}

  async getStats(userId: number) {
    const stat = await this.statService.findOneBy({
      user: { id: userId },
    });
    return stat;
  }

  async create(user: DeepPartial<User>) {
    const newUser = this.userRepository.create(user);
    const savedUser = await this.userRepository.save(user);
    await this.statService.create({ user: savedUser });
    return savedUser;
  }

  async findOneBy(options: FindOptionsWhere<User>) {
    const user = await this.userRepository.findOneBy(options);
    return user;
  }

  async removeRefreshToken(id: number, refresh_token: string) {
    const updatedUser = await this.userRepository.update(
      { id },
      {
        refresh_tokens: () =>
          `array_remove("refresh_tokens", '${refresh_token}')`,
      },
    );
  }

  async updateRefreshTokens(id: number, tokens: string[]) {
    const updatedUser = await this.userRepository.update(
      { id },
      { refresh_tokens: tokens },
    );
  }

  async addRefreshToken(id: number, refresh_token: string) {
    return this.userRepository.update(
      { id },
      {
        refresh_tokens: () =>
          `array_append("refresh_tokens", '${refresh_token}')`,
      },
    );
  }
}
