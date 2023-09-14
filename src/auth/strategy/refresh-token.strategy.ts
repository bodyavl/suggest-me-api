import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../interfaces';

export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'refresh-jwt',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.REFRESH_JWT_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JwtPayload) {
    const refresh_token = req.get('Authorization').replace('Bearer', '').trim();
    return { id: payload.sub, email: payload.email, refresh_token };
  }
}
