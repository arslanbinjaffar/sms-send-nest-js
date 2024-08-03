import { NestFactory } from '@nestjs/core';
import { CommandModule, CommandService } from 'nestjs-command';
import { SeedsModule } from './seed/seeder.module';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(SeedsModule, {
    logger: false,
  });
  app.select(CommandModule).get(CommandService).exec();
}

bootstrap();
