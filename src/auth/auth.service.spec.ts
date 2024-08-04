import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { TokenService } from '../token/token.service';
import { PasswordService } from '../password/password.service';
import { JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: TokenService,
          useValue: {
            generateToken: jest.fn(),
            verifyToken: jest.fn(),
          },
        },
        {
          provide: PasswordService,
          useValue: {
            // Mock the methods used in AuthService
            hashPassword: jest.fn(),
            comparePassword: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            // Mock the methods used in TokenService
            sign: jest.fn(),
            verify: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
