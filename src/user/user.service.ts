import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './model/user.schema';
import { Model } from 'mongoose';
import { createUserDto } from './dto/create-user.dto';
import { loginUserDto } from './dto/login-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async create(createUserDto: createUserDto) {
    return (await this.userModel.create(createUserDto)).save();
  }
  async loginUser(loginUserDto: loginUserDto) {
    const user = await this.userModel.findOne({
      email: loginUserDto.email,
    });
    const hashedPassword = await bcrypt.compare(
      user.password,
      loginUserDto.password,
    );
    if (!user && hashedPassword == user.password) {
      return;
    }
    return user;
  }
  async loginSuperAdmin(loginUserDto: loginUserDto) {
    const user = await this.userModel.findOne({
      email: loginUserDto.email,
    });
    const hashedPassword = await bcrypt.compare(
      user.password,
      loginUserDto.password,
    );
    if (
      !user &&
      hashedPassword == user.password &&
      user.roles !== 'super_admin'
    ) {
      return;
    }
    return user;
  }
}
