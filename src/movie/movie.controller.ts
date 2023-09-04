import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MovieService } from './movie.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Movie } from './entities';



@ApiTags('movie')
@Controller('movie')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}
  
  @Get()
  async findAll() {
    return await this.movieService.findAll();
  }

  @ApiOkResponse({type: Movie})
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.movieService.findOne(+id);
  }
}
