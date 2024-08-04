import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { log } from 'console';
import { User } from '../schemas/user.schema';
import { Payload, Tokens } from '../types';
import { PasswordService } from '../password/password.service';
import { TokenService } from '../token/token.service';
import { variables } from '../../constants';

/**
 * AuthService handles logic related to authentication.
 * It uses UsersService to interact with the database.
 */
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly passwordService: PasswordService,
    private readonly tokenService: TokenService,
  ) {}

  /**
   * Create a new user
   *
   * @param createUserDto - the data provided by the user
   * @returns - the created user
   */
  async createUser(createUserDto: CreateUserDto) {
    try {
      log({ 'user to be created': createUserDto });
      const salt = this.passwordService.generateSalt(32);
      const password = await this.passwordService.hashPassword(
        createUserDto.password,
        salt,
      );
      const userToBeCreated = { ...createUserDto, salt, password };
      const createdUser = await this.usersService.create(userToBeCreated);
      log({ 'user created successfully': createdUser });
      return createdUser;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  /**
   * Validate a user
   *
   * @param username - the username of the user
   * @param password - the password of the user
   * @returns - the user document
   */
  async validateUser(email: string, password: string) {
    try {
      log({ 'searching for user': email });
      const user = await this.usersService.findByEmail(email);
      if (!user) {
        log({ 'user not found': email });
        throw new NotFoundException('User not found');
      }

      log({ 'user found': user });
      if (
        await this.passwordService.passwordIsCorrect(
          password,
          user.salt,
          user.password,
        )
      ) {
        const { password, salt, ...result } = user.toObject();
        log({ 'user logged in': result });
        return result as Payload;
      }
      throw new UnauthorizedException('Invalid password');
    } catch (error) {
      console.error(error);
      // throw error as exception
      throw new InternalServerErrorException(error);
    }
  }

  /**
   * login a user
   *
   * @param email - the email of the user
   * @param password - the password of the user
   * @returns - the access token and refresh token
   */
  async login(user: User): Promise<Tokens> {
    try {
      const tokens = await this.tokenService.generateTokens(user);
      return tokens;
    } catch (error) {
      console.error(error);
      // throw error as exception
      throw new InternalServerErrorException(error);
    }
  }

  /**
   * refresh a user
   * @param refreshToken - the refresh token
   * @returns - the access token and refresh token
   */
  async refresh(refreshToken: string): Promise<Tokens> {
    try {
      console.log('Refreshing with token:', refreshToken);
      const payload: Payload = await this.tokenService.verify(
        refreshToken,
        variables.jwtRefreshSecret,
      );
      console.log('Payload:', payload);
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
      console.error('Error refreshing tokens:', error);
      throw new InternalServerErrorException('Token refresh error');
    }
  }
}
