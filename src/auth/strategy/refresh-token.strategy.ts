import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt } from "passport-jwt";
import { Strategy } from "passport-strategy";

export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'refresh-jwt') {
    constructor() {
        super({
          jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
          ignoreExpiration: false,
          secretOrKey: process.env.REFRESH_TOKEN_SECRET,
        });
      }
    
      async validate(payload: any) {
        return { userId: payload.sub, username: payload.username };
      }
}