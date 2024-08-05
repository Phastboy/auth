import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { Logger } from '@nestjs/common';
import { User } from '../schemas/user.schema';
import { Payload, Tokens } from '../types';
import { PasswordService } from '../password/password.service';
import { TokenService } from '../token/token.service';
import { variables } from '../../constants';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly passwordService: PasswordService,
    private readonly tokenService: TokenService,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    try {
      this.logger.log(`Creating user: ${createUserDto.email}`);
      const salt = this.passwordService.generateSalt(32);
      const password = await this.passwordService.hashPassword(
        createUserDto.password,
        salt,
      );
      const userToBeCreated = { ...createUserDto, salt, password };
      const createdUser = await this.usersService.create(userToBeCreated);
      this.logger.log(`User created successfully: ${createdUser.email}`);
      return createdUser;
    } catch (error) {
      this.logger.error(`Error creating user: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Could not create user');
    }
  }

  async validateUser(email: string, pass: string) {
    try {
      this.logger.log(`Validating user: ${email}`);
      const user = await this.usersService.findByEmail(email);
      if (!user) {
        this.logger.warn(`User not found: ${email}`);
        throw new NotFoundException('User not found');
      }

      const isPasswordValid = await this.passwordService.passwordIsCorrect(
        pass,
        user.salt,
        user.password,
      );

      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid password');
      }

      const { password, salt, ...result } = user.toObject();
      this.logger.log(`User validated: ${result.email}`);
      return result as Payload;
    } catch (error) {
      this.logger.error(`Error validating user: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Could not validate user');
    }
  }

  async login(user: User): Promise<Tokens> {
    try {
      this.logger.log(`Logging in user: ${user.email}`);
      const tokens = await this.tokenService.generateTokens(user);
      return tokens;
    } catch (error) {
      this.logger.error(`Error logging in user: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Could not log in user');
    }
  }

  async refresh(refreshToken: string): Promise<Tokens> {
    try {
      this.logger.log(`Refreshing tokens with refresh token: ${refreshToken}`);
      const payload: Payload = await this.tokenService.verify(
        refreshToken,
        variables.jwtRefreshSecret,
      );

      if (!payload) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const user = await this.usersService.findOne(payload._id);
      if (!user) {
        throw new NotFoundException('User not found');
      }

      const tokens = await this.tokenService.generateTokens(user, refreshToken);
      return tokens;
    } catch (error) {
      this.logger.error(
        `Error refreshing tokens: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('Token refresh error');
    }
  }
}
