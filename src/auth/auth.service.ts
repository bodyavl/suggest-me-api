import { Injectable } from '@nestjs/common';
import { SignInDto, SignUpDto } from './dto';
import { JwtTokens } from './auth.types';

@Injectable()
export class AuthService {

    async signIn(dto: SignInDto) {
        
    }

    async signUp(dto: SignUpDto) {

    }

    
}
