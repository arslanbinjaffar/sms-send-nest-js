import { Module } from '@nestjs/common';
import { CommandModule } from 'nestjs-command';

import { UserService } from 'src/user/user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, userSchema } from 'src/user/model/user.schema';
// import { SharedModule } from './shared.module';

@Module({
    imports: [CommandModule,
        MongooseModule.forFeature([{name:User.name,schema:userSchema}])
    ],
    // providers: [UserSeed,UserService],
    // exports: [UserSeed],
})
export class SeedsModule {}
  