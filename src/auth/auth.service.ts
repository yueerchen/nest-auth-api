import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { Redis } from 'ioredis';
import { RateLimiterRedis } from 'rate-limiter-flexible';

const maxConsecutiveFailsByUsername = 3;
@Injectable()
export class AuthService {
  private readonly limiterConsecutiveFailsByUsername: RateLimiterRedis;
  constructor(
    @InjectModel(User.name)
    private userModal: Model<User>,
    private jwtService: JwtService,
  ) {
    const redisClient = new Redis(process.env.REDIS_URI, {
      enableOfflineQueue: false,
    });
    this.limiterConsecutiveFailsByUsername = new RateLimiterRedis({
      storeClient: redisClient,
      keyPrefix: 'login_fail_consecutive_username',
      points: maxConsecutiveFailsByUsername, // allowed attempts to login
      duration: 60 * 5, // Store number for five minutes since first fail
      blockDuration: 60 * 15, // Block for 15 minutes
    });
  }

  async signUp(signUpDto: SignUpDto): Promise<{ token: string }> {
    const { username, password } = signUpDto;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userModal.create({
      username,
      password: hashedPassword,
    });

    const token = this.jwtService.sign({ id: user._id });

    return { token };
  }

  async login(loginDto: LoginDto): Promise<{ token: string; message: string }> {
    const { username, password } = loginDto;
    const rlResUsername =
      await this.limiterConsecutiveFailsByUsername.get(username);
    // Check if cached failed attempts hit the limitation, yes then lock the user
    if (
      rlResUsername !== null &&
      rlResUsername.consumedPoints >= maxConsecutiveFailsByUsername
    ) {
      throw new UnauthorizedException('User is locked');
    } else {
      // Check if the user exist
      const user = await this.userModal.findOne({ username });
      if (!user) {
        throw new UnauthorizedException('Login Failed, Invalid credentials');
      }

      // Check if user and password matched
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        // Count failed attempts by Username
        await this.limiterConsecutiveFailsByUsername.consume(username);
        throw new UnauthorizedException('Login Failed, Invalid credentials');
      }

      // Reset fail attempts on successful authorization
      if (rlResUsername !== null && rlResUsername.consumedPoints > 0) {
        await this.limiterConsecutiveFailsByUsername.delete(username);
      }
      // Return success and a JWT token if username and password are correct
      const token = this.jwtService.sign({ id: user._id });
      const message = 'Login success';
      return { token, message };
    }
  }
}
