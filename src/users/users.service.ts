import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { Model } from 'mongoose';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const createdUser = new this.userModel(createUserDto);
      const savedUser = await createdUser.save();
      return savedUser;
    } catch (error: any) {
      if (error.code === 11000) {
        throw new Error('Username or Email already exists');
      }

      throw new Error(error);
    }
  }

  async findAll() {
    return this.userModel.find().exec();
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({ email }).exec();
  }

  async findByUsername(username: string) {
    return this.userModel.findOne({ username }).exec();
  }

  async findOne(id: any) {
    return this.userModel.findById(id).exec();
  }

  async update(_id: string, updateUserDto: UpdateUserDto) {
    return this.userModel.findOneAndUpdate({ _id }, updateUserDto).exec();
  }

  async delete(username: string) {
    return this.userModel.findOneAndDelete({ username }).exec();
  }

  async getToTalUserCount() {
    return this.userModel.countDocuments().exec();
  }

  async getUserRolesDistribution() {
    return this.userModel
      .aggregate([
        {
          $group: {
            _id: '$role',
            count: { $sum: 1 },
          },
        },
      ])
      .exec();
  }
}
