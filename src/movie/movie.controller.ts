import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, UseGuards } from '@nestjs/common';
import { MovieService } from './movie.service';
import { ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Movie } from './entities';
import { NotFoundError } from 'rxjs';
import { OptionalAccessTokenGuard } from '../auth/guard';



@ApiTags('movie')
@ApiInternalServerErrorResponse()
@Controller('movie')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}
  
  @ApiOkResponse({type: Movie, isArray: true, description: 'array of 8 movies'})
  @UseGuards(OptionalAccessTokenGuard)
  @Get()
  async findAll() {
    return await this.movieService.findAll();
  }

  @ApiOkResponse({type: Movie, description: 'Movie object'})
  @ApiNotFoundResponse({description: 'movie not found under provided id'})
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.movieService.findOne(+id);
  }
}
