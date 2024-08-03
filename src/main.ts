import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SeederService } from './seed/user.seed';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); 
  await app.listen(process.env.PORT);
  const seederService = app.get(SeederService);
  await seederService.seedSuperAdmin();
  console.log("server listening port")
  // await app.close();
}
bootstrap();
  