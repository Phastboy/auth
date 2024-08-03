import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as crypto from 'crypto';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { log } from 'console';
import { JwtService } from '@nestjs/jwt';

/**
 * AuthService handles logic related to authentication.
 * It uses UsersService to interact with the database.
 * */
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Generate cryptographic salt
   *
   * @param length - length of the salt
   * @returns - the generated salt
   * */
  generateSalt(length: number): string {
    return crypto
      .randomBytes(Math.ceil(length / 2))
      .toString('hex')
      .slice(0, length);
  }

  /**
   * Hash a password
   *
   * @param password - the password to hash
   * @param salt - the salt to use
   * @returns - the hashed password
   * */
  hashPassword(password: string, salt: string): Promise<string> {
    return new Promise((resolve, reject) => {
      crypto.pbkdf2(password, salt, 1000, 64, 'sha512', (err, derivedKey) => {
        if (err) {
          reject(err);
        }
        resolve(derivedKey.toString('hex'));
      });
    });
  }

  /**
   * Create a new user
   *
   * @param createUserDto - the data provided by the user
   * @returns - the created user
   * */
  async createUser(createUserDto: CreateUserDto) {
    try {
      log({ 'user to be created': createUserDto });
      const salt = this.generateSalt(32);
      const password = await this.hashPassword(createUserDto.password, salt);
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
   * passwordIsCorrect checks if the password is correct
   *
   * @param password - the password to verify
   * @param salt - the salt to use
   * @param hash - the hash to compare
   * @returns - true if the password is correct, false otherwise
   * */
  async passwordIsCorrect(
    password: string,
    salt: string,
    hash: string,
  ): Promise<boolean> {
    const hashedPassword = await this.hashPassword(password, salt);
    return hashedPassword === hash;
  }

  /**
   * Validate a user
   *
   * @param username - the username of the user
   * @param password - the password of the user
   * @returns - the user document
   * */
  async validateUser(email: string, password: string) {
    try {
      log({ 'searching for user': email });
      const user = await this.usersService.findByEmail(email);
      if (!user) {
        log({ 'user not found': email });
        throw new NotFoundException('User not found');
      }

      log({ 'user found': user });
      if (await this.passwordIsCorrect(password, user.salt, user.password)) {
        const { password, salt, ...result } = user.toObject();
        log({ 'user logged in': result });
        return result;
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
   * @returns - the user document
   * */
  async login(user: any) {
    try {
      const payload = {
        username: user.username,
        email: user.email,
        sub: user._id,
      };
      return {
        access_token: this.jwtService.sign(payload),
      };
    } catch (error) {
      console.error(error);
      // throw error as exception
      throw new InternalServerErrorException(error);
    }
  }
}
