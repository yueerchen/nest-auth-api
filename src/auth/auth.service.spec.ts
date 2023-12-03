import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getModelToken } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { User } from './schemas/user.schema';
import * as bcrypt from 'bcryptjs';

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        JwtService,
        {
          provide: getModelToken(User.name),
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('login', () => {
    it('should return a token and message on successful login', async () => {
      const mockUser = {
        _id: 'mockUserId',
        username: 'testuser',
        password: await bcrypt.hash('password123', 10),
      };

      jest
        .spyOn(authService['limiterConsecutiveFailsByUsername'], 'get')
        .mockResolvedValue(null);
      jest
        .spyOn(authService['limiterConsecutiveFailsByUsername'], 'consume')
        .mockResolvedValue(null);

      jest
        .spyOn(authService['userModal'], 'findOne')
        .mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

      jest.spyOn(jwtService, 'sign').mockReturnValue('mockToken');

      const loginDto = { username: 'testuser', password: 'password123' };
      const result = await authService.login(loginDto);

      expect(result).toEqual({ token: 'mockToken', message: 'Login success' });
    });

    it('should throw UnauthorizedException when user is locked', async () => {
      const mockRateLimiterRes = {
        consumedPoints: 3,
        msBeforeNext: 1000,
        remainingPoints: 0,
        isFirstInDuration: false,
        toJSON: jest.fn().mockReturnValue({
          consumedPoints: 3,
          msBeforeNext: 1000,
          remainingPoints: 0,
          isFirstInDuration: false,
        }),
      };
      jest
        .spyOn(authService['limiterConsecutiveFailsByUsername'], 'get')
        .mockResolvedValue(mockRateLimiterRes);

      const loginDto = { username: 'testuser', password: 'password123' };

      await expect(authService.login(loginDto)).rejects.toThrowError(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException on failed login attempts', async () => {
      jest
        .spyOn(authService['limiterConsecutiveFailsByUsername'], 'get')
        .mockResolvedValue(null);
      jest
        .spyOn(authService['limiterConsecutiveFailsByUsername'], 'consume')
        .mockResolvedValue(null);

      jest.spyOn(authService['userModal'], 'findOne').mockResolvedValue(null);
      const loginDto = {
        username: 'nonexistentuser',
        password: 'invalidpassword',
      };

      await expect(authService.login(loginDto)).rejects.toThrowError(
        UnauthorizedException,
      );
    });
  });
});
