import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AccessTokenStrategy } from '../auth/strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities';
import { StatModule } from '../stat/stat.module';
import { IsExist } from '../utils/validators/is-exists.validator';
import { IsNotExist } from '../utils/validators/is-not-exists.validator';

@Module({
  exports: [UserService],
  imports: [TypeOrmModule.forFeature([User]), StatModule],
  controllers: [UserController],
  providers: [UserService, AccessTokenStrategy, IsExist, IsNotExist],
})
export class UserModule {}
