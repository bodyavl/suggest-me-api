import { Controller, Get, Param, UseGuards, Query } from '@nestjs/common';
import { MovieService } from './movie.service';
import { ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Movie } from './entities';
import { OptionalAccessTokenGuard } from '../auth/guard';
import { GetUser } from '../auth/decorators';
import { FindMoviesQueryDto } from './dto';



@ApiTags('movie')
@ApiInternalServerErrorResponse()
@Controller('movie')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}
  
  @ApiOkResponse({type: Movie, isArray: true, description: 'array of 8 movies'})
  @UseGuards(OptionalAccessTokenGuard)
  @Get()
  async findAll(@GetUser('id') id: number, @Query() dto: FindMoviesQueryDto) {
    const randomMovies = await this.movieService.findAll()
    if(!id) return randomMovies;
    await this.movieService.updateStats(+id, randomMovies, dto.manual)
    return randomMovies;
  }

  @ApiOkResponse({type: Movie, description: 'Movie object'})
  @ApiNotFoundResponse({description: 'movie not found under provided id'})
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.movieService.findOne(+id);
  }
}
