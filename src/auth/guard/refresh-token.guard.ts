import { AuthGuard } from '@nestjs/passport';

export class RefreshTokenGuard extends AuthGuard('refersh-jwt') {}
