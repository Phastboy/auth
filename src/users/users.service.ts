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
  /**
   * Constructor is used to inject the required services.
   */
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
    return savedUser;
  }

  /**
   * Find all users
   *
   * @returns List of all users
   */
  async findAll() {
    return this.userModel.find().exec();
  }

  /**
   * Find a user by EMAIL
   *
   * @param email - The email of the user
   * @returns The user document
   * */
  async findByEmail(email: string) {
    return this.userModel.findOne({ email }).exec();
  }

  /**
   * Find a user by USERNAME
   *
   * @param username - The username of the user
   * @returns The user document
   */
  async findOne(username: string) {
    return this.userModel.findOne({ username }).exec();
  }

  /**
   * Delete a user by USERNAME
   *
   * @param username - The username of the user
   * @returns The deleted user document
   */
  async delete(username: string) {
    return this.userModel.findOneAndDelete({ username }).exec();
  }
}
