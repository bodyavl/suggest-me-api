import { AuthGuard } from "@nestjs/passport";

export class OptionalJwtAuthGuard extends AuthGuard('access-jwt') {
    handleRequest(err, user, info, context) {
      return user;
    }
  
  }