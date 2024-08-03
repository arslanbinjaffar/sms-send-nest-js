import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { User, userSchema } from "./model/user.schema";
import { userController } from "./user.controller";
import { UserService } from "./user.service";
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthService } from './Jwt.service';


@Module({
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: userSchema }]),
        JwtModule.register({
            secret: 'yourSecretKey', // Replace with your own secret key
            signOptions: { expiresIn: '10m' }, // Token expiration time
          }),
    ],
    controllers: [userController],
    providers: [UserService,JwtAuthService],
    exports:[UserService,JwtAuthService]
})


export class userModule{}