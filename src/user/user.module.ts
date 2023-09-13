import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AccessTokenStrategy } from '../auth/strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities';
import { StatModule } from '../stat/stat.module';

@Module({
  exports: [UserService],
  imports: [TypeOrmModule.forFeature([User]), StatModule],
  controllers: [UserController],
  providers: [UserService, AccessTokenStrategy],
})
export class UserModule {}
