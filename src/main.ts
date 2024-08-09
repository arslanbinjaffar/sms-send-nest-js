import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SeederService } from './seed/user.seed';
import * as express from 'express';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(express.json({ limit: '10mb' })); // Adjust the limit as needed
  app.use(express.urlencoded({ limit: '10mb', extended: true }));
  await app.listen(process.env.PORT);
  const seederService = app.get(SeederService);
  await seederService.seedSuperAdmin();
  console.log('server listening port');
  // await app.close();
}
bootstrap();
