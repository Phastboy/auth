import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { log } from 'console';

/**
 * AuthService handles logic related to authentication.
 * It uses UsersService to interact with the database.
 * */
@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

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
    log({ 'user to be created': createUserDto });
    const salt = this.generateSalt(32);
    const password = await this.hashPassword(createUserDto.password, salt);
    const userToBeCreated = { ...createUserDto, salt, password };
    return this.usersService.create(userToBeCreated);
  }
}
