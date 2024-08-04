import { ObjectId } from 'mongodb';
import { User } from './schemas/user.schema';

/**
 * Role enum
 *
 * @exports Role
 * */
export enum Role {
  USER = 'user',
  ADMIN = 'admin',
}

/**
 * Tokens interface
 * */
export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface Payload extends Omit<User, 'password' | 'salt'> {
  _id: string | ObjectId;
}
