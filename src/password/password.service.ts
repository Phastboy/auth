import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class PasswordService {
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
}
