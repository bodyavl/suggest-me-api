import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SignInDto, SignUpDto } from './dto';
import { JwtTokens } from './auth.types';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(private userService: UserService, private jwt: JwtService) {}

  async signIn(dto: SignInDto): Promise<JwtTokens> {
    const user = await this.userService.findOneBy({ email: dto.email });
    if (!user) throw new ForbiddenException('No user with provided email');

    const isMatch = await argon.verify(user.hash, dto.password);
    if (!isMatch) throw new ForbiddenException('Wrong password');

    const tokens = await this.signTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refresh_token);
    return tokens;
  }

  async signUp(dto: SignUpDto): Promise<JwtTokens> {
    const hash = await argon.hash(dto.password);
    const userExists = await this.userService.findOneBy({
      email: dto.email,
    });
    if (userExists)
      throw new BadRequestException('User with provided email already exists');

    const user = await this.userService.create({
      email: dto.email,
      name: dto.name,
      hash,
    });

    const tokens = await this.signTokens(user.id, user.email);
    console.log(tokens);
    await this.updateRefreshToken(user.id, tokens.refresh_token);

    return tokens;
  }

  async signOut(id: number, refresh_token: string): Promise<void> {
    const user = await this.userService.findOneBy({ id });

    if (!user.refresh_tokens.includes(refresh_token))
      throw new UnauthorizedException('refresh token is not valid');
    await this.userService.removeRefreshToken(id, refresh_token);
  }

  async signTokens(userId: number, email: string): Promise<JwtTokens> {
    const data = {
      sub: userId,
      email,
    };

    const [access_token, refresh_token] = await Promise.all([
      this.jwt.signAsync(data, {
        expiresIn: process.env.ACCESS_JWT_EXPIRES_IN,
        secret: process.env.ACCESS_JWT_SECRET,
      }),
      this.jwt.signAsync(data, {
        expiresIn: process.env.REFRESH_JWT_EXPIRES_IN,
        secret: process.env.REFRESH_JWT_SECRET,
      }),
    ]);

    return { access_token, refresh_token };
  }

  async updateTokens(id: number, refresh_token: string): Promise<JwtTokens> {
    const user = await this.userService.findOneBy({ id });

    if (!user || !user.refresh_tokens)
      throw new ForbiddenException('Access Denied');

    const refreshTokenMatches = user.refresh_tokens.includes(refresh_token);
    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');

    const updated_refresh_tokens = user.refresh_tokens.filter(
      (token) => token !== refresh_token,
    );

    await this.userService.updateRefreshTokens(user.id, updated_refresh_tokens);

    const tokens = await this.signTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refresh_token);
    return tokens;
  }

  async updateRefreshToken(id: number, refresh_token: string) {
    this.userService.addRefreshToken(id, refresh_token);
  }
}
