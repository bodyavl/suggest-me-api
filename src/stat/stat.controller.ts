import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { StatService } from './stat.service';
import { AccessTokenGuard } from '../auth/guard';


@Controller('stat')
export class StatController {
  constructor(private readonly statService: StatService) {}

  @UseGuards(AccessTokenGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.statService.findOne(+id);
  }
}
