import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { getModelToken } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        JwtService,
        {
          provide: getModelToken('User'),
          useValue: {},
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('signUp', () => {
    it('should return a token on successful sign up', async () => {
      jest
        .spyOn(authService, 'signUp')
        .mockResolvedValue({ token: 'mockToken' });

      const signUpDto: SignUpDto = {
        username: 'testuser',
        password: 'password123',
      };
      const result = await authController.signUp(signUpDto);

      expect(result).toEqual({ token: 'mockToken' });
    });
  });

  describe('login', () => {
    it('should return a token on successful login', async () => {
      jest
        .spyOn(authService, 'login')
        .mockResolvedValue({ token: 'mockToken', message: 'Login success' });

      const loginDto: LoginDto = {
        username: 'testuser',
        password: 'password123',
      };
      const result = await authController.login(loginDto);

      expect(result).toEqual({ token: 'mockToken', message: 'Login success' });
    });
  });
});
