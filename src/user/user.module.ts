import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AccessTokenStrategy } from '../auth/strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities';
import { Stat } from '../stat/entities';


@Module({
  imports: [TypeOrmModule.forFeature([User, Stat])],
  controllers: [UserController],
  providers: [UserService, AccessTokenStrategy],
})
export class UserModule {}
