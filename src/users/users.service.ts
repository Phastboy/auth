import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { Model } from 'mongoose';
import { log } from 'console';

/**
 * UsersService handles  logic related to user operations.
 * It uses the User model to interact with the database.
 */
@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  /**
   * Create a new user
   *
   * @param createUserDto - user details
   * @returns The created user document.
   */
  async create(createUserDto: CreateUserDto) {
    const createdUser = new this.userModel(createUserDto);
    const savedUser = await createdUser.save();
    log({ 'user created': savedUser });
    return savedUser;
  }
}
