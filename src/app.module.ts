import { Module, OnModuleInit } from '@nestjs/common';
import { MongooseModule, InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { smsSendModule } from './sms-send/sms.send.module';
import { userModule } from './user/user.module';
import { User, userSchema } from './user/model/user.schema';
import { SeederService } from './seed/user.seed';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    MongooseModule.forFeature([{ name: User.name, schema: userSchema }]),
    smsSendModule,
    userModule,
  ],
  controllers: [AppController],
  providers: [AppService, SeederService],
})
export class AppModule implements OnModuleInit {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  onModuleInit() {
    this.connection.on('connected', () => {
      console.log('Database connection established successfully');
    });

    this.connection.on('error', (err) => {
      console.error('Database connection error:', err);
    });
  }
}
