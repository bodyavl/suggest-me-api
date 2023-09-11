import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto, SignUpDto } from './dto';
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiForbiddenResponse, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { JwtTokens } from './auth.types';
import { GetUser } from './decorators';
import { RefreshTokenGuard } from './guard';


@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiCreatedResponse({type: JwtTokens})
  @ApiForbiddenResponse({description: 'when provided credentials are wrong or taken'})
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  async signIn(@Body() dto: SignInDto) {
    return this.authService.signIn(dto)
  }

  @ApiOkResponse({type: JwtTokens})
  @ApiBadRequestResponse({description: 'when user with provided email exists'})
  @Post('signup')
  async signUp(@Body() dto: SignUpDto){
    return this.authService.signUp(dto)
  }

  @ApiOkResponse({type: JwtTokens})
  @ApiForbiddenResponse({description: 'If refresh token is not valid'})
  @ApiBearerAuth('refresh token')
  @UseGuards(RefreshTokenGuard)
  @Get('tokens')
  async updateTokens(
    @GetUser('id') id: number,
    @GetUser('refresh_token') refresh_token: string,
  ) {
    return this.authService.updateTokens(id, refresh_token);
  }

  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  @ApiBearerAuth('refresh token')
  @UseGuards(RefreshTokenGuard)
  @Delete('signout')
  async signOut(@GetUser('id') id: number, @GetUser('refresh_token') refresh_token: string) {
    return this.authService.signOut(id, refresh_token)
  }
}
