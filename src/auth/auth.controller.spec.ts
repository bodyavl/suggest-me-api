import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;

  class mockAuthService {
    signIn = () => {
      return {
        access_token: 'token',
        refresh_token: 'token',
      };
    }
    signUp = () => {
      return {
        access_token: 'token',
        refresh_token: 'token',
      };
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    }).overrideProvider(AuthService).useClass(mockAuthService).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should sign up user', () => {
    expect(
      controller.signUp({
        email: 'test@gmail.com',
        password: 'test',
        name: 'test',
      }),
    ).toEqual({
      access_token: expect.any(String),
      refresh_token: expect.any(String),
    });
  });

  it('should sign in user', async () => {
    expect(
      controller.signIn({ email: 'test@gmail.com', password: 'test' }),
    ).toEqual({
      access_token: expect.any(String),
      refresh_token: expect.any(String),
    });
    
  });
});
