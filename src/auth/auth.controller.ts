import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto, SignUpDto } from './dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JwtTokens } from './auth.types';


@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiCreatedResponse({type: JwtTokens})
  @Post('signin')
  async signIn(@Body() dto: SignInDto) {
    return this.authService.signIn(dto)
  }

  @ApiOkResponse({type: JwtTokens})
  @Post('signup')
  async signUp(@Body() dto: SignUpDto){
    return this.authService.signUp(dto)
  }
}
