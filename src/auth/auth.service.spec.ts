import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../user/entities';
import { Stat } from '../stat/entities';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2'
import passport from 'passport';

describe('AuthService', () => {
  let service: AuthService;

  const mockUser = {
    id: Date.now(),
    email: 'test@gmail.com',
    hash: '$test',
    name: 'test',
    refresh_tokens: ['token'],
  };

  const mockUsersRepository = {
    findOneBy: jest.fn().mockImplementation((dto) => {
      return undefined;
    }),
    create: jest.fn().mockImplementation((dto) => dto),
    save: jest
      .fn()
      .mockImplementation((dto) => Promise.resolve({ id: Date.now(), ...dto })),
    update: jest.fn().mockImplementation(() => Promise.resolve(mockUser)),
  };

  const mockStatRepository = {
    create: jest.fn().mockImplementation((dto) => dto),
    save: jest
      .fn()
      .mockImplementation((dto) => Promise.resolve({ id: Date.now(), ...dto })),
  };

  const mockJwtService = {
    signAsync: jest
      .fn()
      .mockImplementation((data, options) => Promise.resolve('token')),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        JwtService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUsersRepository,
        },
        {
          provide: getRepositoryToken(Stat),
          useValue: mockStatRepository,
        },
      ],
    })
      .overrideProvider(JwtService)
      .useValue(mockJwtService)
      .compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should sign up a user', async () => {
    const dto = {
      email: 'test@gmail.com',
      password: 'test',
      name: 'test',
    };

    const result = await service.signUp(dto);
    expect(result).toEqual({
      access_token: expect.any(String),
      refresh_token: expect.any(String),
    });

    expect(mockUsersRepository.create).toBeCalled()
  });

  it('should sign in a user', async () => {
    const dto = {
      email: 'test@gmail.com',
      password: 'test',
    };
    const hash = await argon.hash(dto.password)
    mockUser.hash = hash
    jest
      .spyOn(mockUsersRepository, 'findOneBy')
      .mockImplementation(() => mockUser);

    const result = await service.signIn(dto);
    expect(result).toEqual({
      access_token: expect.any(String),
      refresh_token: expect.any(String),
    });

    expect(mockUsersRepository.findOneBy).toBeCalledWith({email: dto.email})
  });

  it('should sign tokens', async () => {
    const dto = {
      userId: Date.now(),
      email: 'test@gmail.com'
    }

    const res = await service.signTokens(dto.userId, dto.email)
    expect(res).toEqual({
      access_token: expect.any(String),
      refresh_token: expect.any(String),
    });

    expect(mockJwtService.signAsync).toBeCalled()
  })

  it('should update tokens', async () => {
    const res = await service.updateTokens(Date.now(), 'token')
    expect(res).toEqual({
      access_token: expect.any(String),
      refresh_token: expect.any(String),
    })

    expect(mockJwtService.signAsync).toBeCalled()
  })
});
