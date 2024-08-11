import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class AdminService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

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

  async delete(username: string) {
    return this.userModel.findOneAndDelete({ username }).exec();
  }
}
