import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  const port = process.env.WEB_SERVER_PORT || 3000;
  console.log(`🚀 Starting app on port ${port}`);
  await app.listen(port, '0.0.0.0');
}
bootstrap();
