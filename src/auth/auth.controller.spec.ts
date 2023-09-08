import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;

  const mockAuthService = {
    signIn: jest.fn().mockReturnValue({
      access_token: 'token',
      refresh_token: 'token',
    }),
    signUp: jest.fn().mockReturnValue({
      access_token: 'token',
      refresh_token: 'token',
    }),
    updateTokens: jest.fn().mockReturnValue({
      access_token: 'token',
      refresh_token: 'token',
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    })
      .overrideProvider(AuthService)
      .useValue(mockAuthService)
      .compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should sign up user', async () => {
    const dto ={
      email: 'test@gmail.com',
      password: 'test',
      name: 'test',
    }
    const result = await controller.signUp(dto);
    expect(result).toEqual({
      access_token: expect.any(String),
      refresh_token: expect.any(String),
    });

    expect(mockAuthService.signUp).toHaveBeenCalledWith(dto)
  });

  it('should sign in user', async () => {
    const dto = {
      email: 'test@gmail.com',
      password: 'test',
    }
    const result = await controller.signIn(dto);
    expect(result).toEqual({
      access_token: expect.any(String),
      refresh_token: expect.any(String),
    });
    
    expect(mockAuthService.signIn).toBeCalledWith(dto)
  });

  it('should return tokens', async () => {
    const result = await controller.updateTokens(0, 'test');
    expect(result).toEqual({
      access_token: expect.any(String),
      refresh_token: expect.any(String),
    });

    expect(mockAuthService.updateTokens).toBeCalledWith(0, 'test')
  });
});
