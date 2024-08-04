import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenGuard } from './jwt-refresh-auth.guard';

describe('RefreshTokenGuard', () => {
  let guard: RefreshTokenGuard;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RefreshTokenGuard,
        {
          provide: JwtService,
          useValue: {
            // Mock the methods used in RefreshTokenGuard
            verify: jest.fn(),
          },
        },
      ],
    }).compile();

    guard = module.get<RefreshTokenGuard>(RefreshTokenGuard);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });
});
