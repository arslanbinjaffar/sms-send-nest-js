import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from 'src/user/model/user.schema';

@Injectable()
export class SeederService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async seedSuperAdmin() {
    const email = 'superadmin@gmail.com';
    const password = 'superadminpassword';
    const roles = 'super_admin';

    const existingUser = await this.userModel.findOne({ email }).exec();
    if (existingUser) {
      console.log('Super admin already exists.');
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const superAdmin = new this.userModel({
      email,
      password: hashedPassword,
      roles,
      isActive: true,
    });

    await superAdmin.save();
    console.log('Super admin created successfully.');
  }
}
