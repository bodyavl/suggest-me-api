import { Strategy } from "passport-strategy";
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt } from "passport-jwt";

export class AccessTokenStrategy extends PassportStrategy(Strategy, 'access-jwt') {
    constructor() {
        super({
          jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
          ignoreExpiration: false,
          secretOrKey: process.env.ACCESS_TOKEN_SECRET,
        });
      }
    
      async validate(payload: any) {
        return { userId: payload.sub, username: payload.username };
      }
}