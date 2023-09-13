import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AccessTokenGuard } from '../auth/guard';
import { GetUser } from '../auth/decorators';
import { ApiBearerAuth, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  @ApiBearerAuth('Access token')
  @UseGuards(AccessTokenGuard)
  @Get('stat')
  async getStats(@GetUser('id') id: number) {
    return this.userService.getStats(id)
  }
}
