import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { Model } from 'mongoose';
import { log } from 'console';

/**
 * Users Service
 *
 * Handles  logic related to user operations.
 *
 * @export UsersService
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
    log({ 'user to be created': createUserDto });
    const createdUser = new this.userModel(createUserDto);
    const savedUser = await createdUser.save();
    return savedUser;
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
