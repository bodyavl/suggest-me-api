import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SignInDto, SignUpDto } from './dto';
import { JwtTokens } from './auth.types';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';
import { Stat } from '../stat/entities';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Stat) private statRepository: Repository<Stat>,
    private jwt: JwtService,
  ) {}

  async signIn(dto: SignInDto): Promise<JwtTokens> {
    const user = await this.userRepository.findOneBy({ email: dto.email });
    if (!user) throw new ForbiddenException('No user with provided email');
    const isMatch = await argon.verify(user.hash, dto.password);
    if (!isMatch) throw new ForbiddenException('Wrong password');
    const tokens = await this.signTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refresh_token);
    return tokens;
  }

  async signUp(dto: SignUpDto): Promise<JwtTokens> {
    const hash = await argon.hash(dto.password);
    const userExists = await this.userRepository.findOneBy({
      email: dto.email,
    });
    if (userExists)
      throw new BadRequestException('User with provided email already exists');

    const user = this.userRepository.create({
      email: dto.email,
      name: dto.name,
      hash,
    });
    await this.userRepository.save(user);
    const stat = this.statRepository.create({ user });
    await this.statRepository.save(stat);
    const tokens = await this.signTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refresh_token);

    return tokens;
  }

  async signOut(id: number, refresh_token: string) {
    const user = await this.userRepository.findOneBy({id})
    if(!user.refresh_tokens.includes(refresh_token)) throw new UnauthorizedException('refresh token is not valid')
    const updatedUser = await this.userRepository.update(
      { id },
      {
        refresh_tokens: () =>
          `array_remove("refresh_tokens", '${refresh_token}')`,
      },
    );
  }

  async signTokens(userId: number, email: string): Promise<JwtTokens> {
    const data = {
      sub: userId,
      email,
    };

    const [access_token, refresh_token] = await Promise.all([
      this.jwt.signAsync(data, {
        expiresIn: '7d',
        secret: process.env.ACCESS_TOKEN_SECRET,
      }),
      this.jwt.signAsync(data, {
        expiresIn: '30d',
        secret: process.env.REFRESH_TOKEN_SECRET,
      }),
    ]);

    return { access_token, refresh_token };
  }

  async updateTokens(id: number, refresh_token: string): Promise<JwtTokens> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user || !user.refresh_tokens)
      throw new ForbiddenException('Access Denied');
    const refreshTokenMatches = user.refresh_tokens.includes(refresh_token);
    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');
    const updated_refresh_tokens = user.refresh_tokens.filter(
      (token) => token !== refresh_token,
    );
    const updatedUser = await this.userRepository.update(
      { id },
      { refresh_tokens: updated_refresh_tokens },
    );
    const tokens = await this.signTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refresh_token);
    return tokens;
  }

  async updateRefreshToken(id: number, refresh_token: string) {
    await this.userRepository.update(
      { id },
      {
        refresh_tokens: () =>
          `array_append("refresh_tokens", '${refresh_token}')`,
      },
    );
  }
}
