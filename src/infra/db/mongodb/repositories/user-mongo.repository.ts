import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from '../schemas/user.schema';
import { UserRepository } from 'src/domain/user/repositories/user.repository';
import { User } from 'src/domain/user/entities/user.entity';

@Injectable()
export class UserMongoRepository implements UserRepository {
  constructor(@InjectModel('User') private readonly userModel: Model<UserDocument>) {}

  async findByUsername(username: string): Promise<User | null> {
    const user = await this.userModel.findOne({ username }).exec();
    if (!user) return null;
    return new User(user._id, user.username, user.password);
  }

  async create(user: User): Promise<User> {
    const { username, password } = user;
    const createdUser = new this.userModel({ username, password });
    await createdUser.save();
    return new User(createdUser._id, createdUser.username, createdUser.password);
  }
}
