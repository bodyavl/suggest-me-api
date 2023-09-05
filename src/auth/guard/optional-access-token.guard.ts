import { AuthGuard } from "@nestjs/passport";

export class OptionalAccessTokenGuard extends AuthGuard('access-jwt') {
    handleRequest(err, user, info, context) {
      return user;
    }
  
  }