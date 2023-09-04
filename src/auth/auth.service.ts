import { Injectable } from '@nestjs/common';
import { SignInDto, SignUpDto } from './dto';
import { JwtTokens } from './auth.types';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities';
import { Repository, TypeORMError } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwt: JwtService,
  ) {}

  async signIn(dto: SignInDto) {}

  async signUp(dto: SignUpDto) {
    try {
      const hash = await argon.hash(dto.password);
      const user = this.userRepository.create({
        email: dto.email,
        name: dto.name,
        hash,
      });
      return this.userRepository.save(user);
    } catch (error) {
        
    }
  }

  async signTokens(userId: number, email: string) {
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

  //   async updateTokens(id: string, refresh_token: string) {
  //     const user = await this.userRepository.findById(id);
  //     if (!user || !user.refresh_tokens)
  //       throw new ForbiddenException('Access Denied');
  //     const refreshTokenMatches = user.refresh_tokens.includes(refresh_token);
  //     if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');
  //     const updated_refresh_tokens = user.refresh_tokens.filter(
  //       (token) => token !== refresh_token,
  //     );
  //     const updatedUser = await this.userModel.findByIdAndUpdate(
  //       id,
  //       { refresh_tokens: updated_refresh_tokens },
  //       { new: true },
  //     );
  //     const tokens = await this.signTokens(user.id, user.email);
  //     await this.updateRefreshToken(user.id, tokens.refresh_token);
  //     return tokens;
  //   }

  //   async updateRefreshToken(id: string, refresh_token: string) {
  //     await this.userModel.findByIdAndUpdate(id, {
  //       $push: { refresh_tokens: refresh_token },
  //     });
  //   }
}
